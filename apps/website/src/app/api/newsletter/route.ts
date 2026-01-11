import { NextResponse } from "next/server";

import { env } from "~/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email } = body as {
      email: string;
    };

    // Get Airtable credentials from environment variables
    const airtableApiKey = env.AIRTABLE_API_KEY;
    const airtableBaseId = env.AIRTABLE_BASE_ID;
    const airtableTableId = env.AIRTABLE_TABLE_ID;
    const airtableTableName = env.AIRTABLE_TABLE_NAME;

    // Use table ID if available, otherwise use table name
    const tableIdentifier = airtableTableId || airtableTableName;

    // Validate we have required values
    if (!airtableApiKey || !airtableBaseId || !tableIdentifier) {
      console.error("Missing required Airtable configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const apiUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(tableIdentifier)}`;

    // Create record in Airtable
    const airtableResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Email: email,
        },
      }),
    });

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json().catch(() => ({}));
      console.error("Airtable API error:", {
        status: airtableResponse.status,
        message: errorData?.error?.message,
      });

      // Return generic error message to avoid exposing internal details
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 500 },
      );
    }

    const data = await airtableResponse.json();

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
