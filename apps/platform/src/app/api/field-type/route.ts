import { NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";

const fieldTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
]);

export async function POST(request: Request) {
  try {
    const { input } = await request.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { output } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      output: Output.object({
        name: "FieldTypePrediction",
        description: "Predicted field type for a form question",
        schema: z.object({
          fieldType: fieldTypeSchema,
          reasoning: z
            .string()
            .describe("Brief explanation for why this type was chosen"),
        }),
      }),
      prompt: `You are a form builder assistant. Based on the question text below, determine the most appropriate field type.

Available field types:
- "text": Short text input (names, emails, single words/phrases)
- "textarea": Long text input (descriptions, comments, paragraphs)
- "number": Numeric input (age, quantity, ratings)
- "select": Single choice from predefined options (country, category)
- "multiselect": Multiple choices from predefined options (interests, skills)

Question: "${input}"

Analyze the question and predict the most suitable field type. Consider:
- Does it ask for a short answer or long explanation?
- Does it expect a number?
- Does it imply choosing from options?
- Does it allow multiple selections?`,
    });

    return NextResponse.json({
      fieldType: output.fieldType,
      reasoning: output.reasoning,
    });
  } catch (error) {
    console.error("Field type prediction error:", error);
    return NextResponse.json(
      {
        error: "Failed to predict field type",
        fieldType: "text", // fallback
      },
      { status: 500 },
    );
  }
}
