import type { UIMessage } from "ai";
import type {
  Chat,
  ChatMessage as DbChatMessage,
  ChatAttachment,
  InsertChatMessageParams,
} from "@intellibus/db";
import type { DiagnosisAttachment, DiagnosisChatMessage, DiagnosisMessageMetadata } from "@/components/chat/types";

function ensureTimestamp(metadata: DiagnosisMessageMetadata | null | undefined, fallback?: Date): string | undefined {
  if (metadata?.timestamp) {
    return metadata.timestamp;
  }
  return fallback ? fallback.toISOString() : undefined;
}

function cloneAttachments(attachments: ChatAttachment[] | null | undefined): DiagnosisAttachment[] | undefined {
  if (!attachments || attachments.length === 0) {
    return undefined;
  }

  return attachments.map((attachment) => ({
    id: attachment.id,
    mediaType: attachment.mediaType,
    dataUrl: attachment.dataUrl,
    filename: attachment.filename,
    alt: attachment.alt,
    labels: attachment.labels as DiagnosisAttachment["labels"],
  }));
}

export function dbMessageToDiagnosisMessage(message: DbChatMessage): DiagnosisChatMessage {
  const metadata = (message.metadata ?? null) as DiagnosisMessageMetadata | null;
  const attachments = cloneAttachments(message.attachments as ChatAttachment[] | undefined);
  const timestamp = ensureTimestamp(metadata, message.createdAt ? new Date(message.createdAt) : undefined);

  const mergedMetadata: DiagnosisMessageMetadata | undefined =
    metadata || attachments || timestamp
      ? {
          ...(metadata ?? {}),
          attachments,
          timestamp,
        }
      : undefined;

  return {
    id: message.id,
    role: message.role as DiagnosisChatMessage["role"],
    parts: (Array.isArray(message.parts) ? message.parts : []) as DiagnosisChatMessage["parts"],
    metadata: mergedMetadata,
  };
}

export function extractAttachmentsFromMessage(message: UIMessage): ChatAttachment[] {
  const attachments: ChatAttachment[] = [];

  for (const part of message.parts) {
    if (part.type === "file" && typeof part.url === "string") {
      attachments.push({
        id: part.id ?? crypto.randomUUID(),
        mediaType: part.mediaType ?? "application/octet-stream",
        dataUrl: part.url,
        filename: part.filename,
        alt:
          (message.metadata as DiagnosisMessageMetadata | undefined)?.image?.alt ??
          part.filename ??
          "Attachment",
        labels: (message.metadata as DiagnosisMessageMetadata | undefined)?.image?.labels,
      });
    }
  }

  const metadataAttachments =
    (message.metadata as DiagnosisMessageMetadata | undefined)?.attachments ?? undefined;

  if (metadataAttachments) {
    for (const metaAttachment of metadataAttachments) {
      if (!attachments.some((attachment) => attachment.id === metaAttachment.id)) {
        attachments.push({
          id: metaAttachment.id,
          mediaType: metaAttachment.mediaType,
          dataUrl: metaAttachment.dataUrl,
          filename: metaAttachment.filename,
          alt: metaAttachment.alt,
          labels: metaAttachment.labels,
        });
      }
    }
  }

  return attachments;
}

export function diagnosisMessageToInsertParams(
  message: DiagnosisChatMessage,
  chat: Chat,
): InsertChatMessageParams {
  const metadata = message.metadata ?? undefined;
  const createdAt = metadata?.timestamp ? new Date(metadata.timestamp) : new Date();

  return {
    chatId: chat.id,
    id: message.id,
    role: message.role,
    parts: message.parts,
    attachments: extractAttachmentsFromMessage(message),
    metadata: metadata ? { ...metadata } : null,
    createdAt: createdAt instanceof Date && !Number.isNaN(createdAt.valueOf()) ? createdAt : new Date(),
  };
}
