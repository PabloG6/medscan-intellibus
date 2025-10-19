'use server';

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const chatMetadataSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(240),
});

export type ChatMetadata = z.infer<typeof chatMetadataSchema>;

const defaultMetadata: ChatMetadata = {
  title: "New Diagnostic Session",
  description: "AI-assisted assessment workspace for upcoming medical imaging analysis.",
};

export async function generateChatMetadata(): Promise<ChatMetadata> {
  try {
    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: chatMetadataSchema,
      messages: [
        {
          role: "system",
          content:
            "You generate concise, professional titles and descriptions for medical imaging diagnostic sessions.",
        },
        {
          role: "user",
          content:
            "Create a short, readable title and a single-sentence description for a new diagnostic chat session. " +
            "Keep the tone clinical yet approachable. The description should emphasise rapid triage and assisted analysis.",
        },
      ],
    });

    return chatMetadataSchema.parse(result.object);
  } catch (error) {
    console.error("Failed to generate chat metadata", error);
    return defaultMetadata;
  }
}
