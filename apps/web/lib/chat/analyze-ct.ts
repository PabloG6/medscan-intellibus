import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { env } from "@/env";

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

// Vision API types
interface VisionPrediction {
  label: string;
  confidence: number;
}

interface VisionApiResponse {
  model: string;
  top5: VisionPrediction[];
}

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

/**
 * Call the vision FastAPI endpoint to get disease predictions
 */
async function getVisionPredictions(base64Image: string): Promise<VisionPrediction[]> {
  try {
    const response = await fetch(`${env.VISION_API_URL}/predict/cxr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_base64: base64Image,
      }),
    });

    if (!response.ok) {
      console.error("Vision API error:", await response.text());
      // Return empty predictions if vision API fails
      return [];
    }

    const data: VisionApiResponse = await response.json();
    return data.top5 || [];
  } catch (error) {
    console.error("Failed to call vision API:", error);
    // Return empty predictions if vision API fails
    return [];
  }
}

export async function analyzeCTScan(imageDataUrl: string): Promise<CtAnalysisResult> {
  const { base64, mediaType } = extractBase64(imageDataUrl);

  // Step 1: Get disease predictions from vision API
  const visionPredictions = await getVisionPredictions(base64);

  // Format vision predictions for the prompt
  let diseasePredictionsText = "";
  if (visionPredictions.length > 0) {
    diseasePredictionsText = "\n\n**Disease Classification Model Predictions:**\n";
    visionPredictions.forEach((pred, idx) => {
      diseasePredictionsText += `${idx + 1}. ${pred.label}: ${(pred.confidence * 100).toFixed(1)}% confidence\n`;
    });
    diseasePredictionsText += "\nUse these predictions to inform your analysis and identify likely anatomical regions where these conditions may be present.";
  }

  // Step 2: Use vision predictions as context for generateObject
  const result = await generateObject({
    model: google("gemini-2.5-flash"),
    schema: ctAnalysisSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this chest X-ray/CT scan image and return structured data with:
1. Classification of scan type and body region
2. Bounding boxes for major anatomical structures and any detected abnormalities
3. General observations
${diseasePredictionsText}

IMPORTANT - Use NORMALIZED coordinates [x1, y1, x2, y2] in range 0.0-1.0 where:
- (0.0, 0.0) is the top-left corner
- (1.0, 1.0) is the bottom-right corner
- Example: center of image would be approximately [0.4, 0.4, 0.6, 0.6]

When creating bounding boxes:
- If disease predictions are provided above, try to identify and localize where these conditions might be visible in the image
- Include bounding boxes for normal anatomical structures (heart, lungs, etc.)
- Include bounding boxes for any abnormalities or regions of interest related to the predicted conditions
- Each bounding box should have a descriptive label and confidence score

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
