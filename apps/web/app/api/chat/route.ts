import {
  createIdGenerator,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type InferUIMessageChunk,
} from "ai";
import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import {
  createChat,
  getChat,
  getChatMessages,
  insertChatMessage,
} from "@intellibus/db";
import type { DiagnosisChatMessage } from "@/components/chat/types";
import {
  dbMessageToDiagnosisMessage,
  diagnosisMessageToInsertParams,
} from "@/lib/chat/transformers";
import { getDB } from "@intellibus/db";
import { analyzeCTScan } from "@/lib/chat/analyze-ct";
import type { ImageLabel } from "@/components/image-with-labels";

export const maxDuration = 30;

type ChatRequestBody = {
  chatId?: string | null;
  messages?: DiagnosisChatMessage[];
  title?: string;
};

export async function POST(request: Request) {
  function clampPercentage(value: number): number {
    if (Number.isFinite(value)) {
      return Math.min(Math.max(value, 0), 100);
    }
    return 0;
  }
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: Object.fromEntries(request.headers.entries()),
  });

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as ChatRequestBody;
  const messages = body.messages ?? [];
  const db = await getDB();

  const chat =
    (body.chatId ? await getChat(db, body.chatId, session.user.id) : null) ??
    (await createChat(db, {
      userId: session.user.id,
      title: body.title ?? "New Chat",
    }));

  if (messages.length === 0) {
    return NextResponse.json(
      {
        chatId: chat.id,
        messages: [],
      },
      {
        headers: {
          "x-chat-id": chat.id,
        },
      },
    );
  }

  const existingMessages = await getChatMessages(db, chat.id, session.user.id);
  const existingIds = new Set(existingMessages.map((message) => message.id));

  const newMessages = messages.filter((message) => !existingIds.has(message.id));

  for (const message of newMessages) {
    await insertChatMessage(
      db,
      diagnosisMessageToInsertParams(message, chat),
      session.user.id,
    );
  }

  const fullHistory = await getChatMessages(db, chat.id, session.user.id);
  const uiMessages = fullHistory.map(dbMessageToDiagnosisMessage);

  const lastMessage = uiMessages[uiMessages.length - 1];

  if (!lastMessage || lastMessage.role !== "user") {
    return NextResponse.json(
      {
        chatId: chat.id,
        messages: uiMessages,
      },
      {
        headers: {
          "x-chat-id": chat.id,
        },
      },
    );
  }

  const attachments = lastMessage.metadata?.attachments ?? [];

  let assistantMessage: DiagnosisChatMessage;

  if (attachments.length === 0) {
    assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Please upload a CT scan image so I can analyze it and provide structured findings.",
        },
      ],
      metadata: {
        timestamp: new Date().toISOString(),
      },
    };
  } else {
    const primaryAttachment = attachments[0];
    const analysis = await analyzeCTScan(primaryAttachment.dataUrl);

    const labels: ImageLabel[] = analysis.bounding_boxes.map((bbox, index) => {
      const [x1, y1, x2, y2] = bbox.coordinates;
      const centerX = clampPercentage(((x1 + x2) / 2) * 100);
      const centerY = clampPercentage(((y1 + y2) / 2) * 100);

      return {
        id: `bbox-${index}`,
        x: centerX,
        y: centerY,
        text: `${bbox.label} (${(bbox.confidence * 100).toFixed(1)}%)`,
      };
    });

    const attachmentsWithLabels = attachments.map((attachment, index) => ({
      ...attachment,
      labels: index === 0 ? labels : attachment.labels,
    }));

    const summaryLines: string[] = [
      `**Classification:** ${analysis.classification.label} (${(
        analysis.classification.confidence * 100
      ).toFixed(1)}% confidence)`,
      `**Description:** ${analysis.classification.description}`,
    ];

    if (analysis.bounding_boxes.length > 0) {
      summaryLines.push("");
      summaryLines.push("**Detected Structures:**");
      for (const bbox of analysis.bounding_boxes) {
        summaryLines.push(
          `• ${bbox.label} — ${(bbox.confidence * 100).toFixed(1)}% confidence ` +
            `[${bbox.coordinates.map((value) => value.toFixed(2)).join(", ")}]`,
        );
      }
    }

    summaryLines.push("");
    summaryLines.push(`**General Observations:** ${analysis.general_observations}`);

    const timestamp = new Date().toISOString();

    const parts: DiagnosisChatMessage["parts"] = [
      {
        type: "text",
        text: summaryLines.join("\n"),
      },
      ...attachments.map((attachment) => ({
        type: "file" as const,
        url: attachment.dataUrl,
        mediaType: attachment.mediaType,
        filename: attachment.filename,
      })),
    ];

    assistantMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      parts,
      metadata: {
        timestamp,
        image: {
          alt: primaryAttachment.alt ?? analysis.classification.label,
          labels,
          editable: true,
        },
        attachments: attachmentsWithLabels,
      },
    };
  }

  await insertChatMessage(
    db,
    diagnosisMessageToInsertParams(assistantMessage, chat),
    session.user.id,
  );

  const stream = createUIMessageStream({
    originalMessages: uiMessages,
    generateId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    async execute({ writer }) {
      const startChunk: InferUIMessageChunk<DiagnosisChatMessage> = {
        type: "start",
        messageId: assistantMessage.id,
        messageMetadata: assistantMessage.metadata,
      };
      writer.write(startChunk);

      let partIndex = 0;
      for (const part of assistantMessage.parts) {
        if (part.type === "text") {
          const id = `text-${assistantMessage.id}-${partIndex++}`;
          const start: InferUIMessageChunk<DiagnosisChatMessage> = {
            type: "text-start",
            id,
          };
          const delta: InferUIMessageChunk<DiagnosisChatMessage> = {
            type: "text-delta",
            id,
            delta: part.text,
          };
          const end: InferUIMessageChunk<DiagnosisChatMessage> = {
            type: "text-end",
            id,
          };
          writer.write(start);
          writer.write(delta);
          writer.write(end);
        } else if (part.type === "file") {
          const fileChunk: InferUIMessageChunk<DiagnosisChatMessage> = {
            type: "file",
            url: part.url,
            mediaType: part.mediaType,
          };
          writer.write(fileChunk);
        }
      }

      const finishChunk: InferUIMessageChunk<DiagnosisChatMessage> = {
        type: "finish",
        messageMetadata: assistantMessage.metadata,
      };
      writer.write(finishChunk);
    },
  });

  return createUIMessageStreamResponse({
    status: 200,
    statusText: "OK",
    headers: {
      "x-chat-id": chat.id,
    },
    stream,
  });
}
