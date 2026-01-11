import { NextResponse } from "next/server";
import { FIELD_TYPES, inputSchema } from "@/components/form-builder";
import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { type } from "arktype";
import { z } from "zod";

// Zod schema for AI SDK (which requires Zod, not arktype)
const fieldTypeZodSchema = z.enum(FIELD_TYPES);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { input?: unknown };
    const data = inputSchema(body);

    if (data instanceof type.errors) {
      return NextResponse.json({ error: data.summary }, { status: 400 });
    }
    const { output } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      output: Output.object({
        name: "FieldTypePrediction",
        description: "Predicted field type for a form question",
        schema: z.object({
          fieldType: fieldTypeZodSchema,
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

Question: "${data.input}"

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
        fieldType: "text",
      },
      { status: 500 },
    );
  }
}
