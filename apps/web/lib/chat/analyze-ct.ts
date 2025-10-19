import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const ctAnalysisSchema = z.object({
  classification: z.object({
    label: z.string(),
    confidence: z.number(),
    description: z.string(),
  }),
  bounding_boxes: z
    .array(
      z.object({
        label: z.string(),
        coordinates: z.array(z.number()).length(4),
        confidence: z.number(),
      }),
    )
    .default([]),
  general_observations: z.string().default(""),
});

export type CtAnalysisResult = z.infer<typeof ctAnalysisSchema>;

function extractBase64(dataUrl: string): { base64: string; mediaType: string } {
  const matches = /^data:(.+?);base64,(.+)$/u.exec(dataUrl);
  if (!matches) {
    return {
      base64: dataUrl,
      mediaType: "image/png",
    };
  }

  return {
    base64: matches[2],
    mediaType: matches[1] ?? "image/png",
  };
}

export async function analyzeCTScan(imageDataUrl: string): Promise<CtAnalysisResult> {
  const { base64, mediaType } = extractBase64(imageDataUrl);

  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: ctAnalysisSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this CT scan image and return structured data with:
1. Classification of CT scan type and body region
2. Bounding boxes for major anatomical structures
3. General observations

IMPORTANT - Use NORMALIZED coordinates [x1, y1, x2, y2] in range 0.0-1.0 where:
- (0.0, 0.0) is the top-left corner
- (1.0, 1.0) is the bottom-right corner
- Example: center of image would be approximately [0.4, 0.4, 0.6, 0.6]

Confidence scores should be 0.0-1.0. Educational purposes only.`,
          },
          {
            type: "image",
            mediaType: mediaType,
            image: base64,
          },
        ],
      },
    ],
  });

  return ctAnalysisSchema.parse(result.object);
}
