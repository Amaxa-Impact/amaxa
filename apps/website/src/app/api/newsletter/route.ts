import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Get Airtable credentials from environment variables
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    const airtableTableName = process.env.AIRTABLE_TABLE_NAME || "Newsletter Subscribers";

    if (!airtableApiKey || !airtableBaseId) {
      console.error("Missing Airtable configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Create record in Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Email: email,
            "Subscribed At": new Date().toISOString(),
          },
        }),
      }
    );

    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.json().catch(() => ({}));
      console.error("Airtable API error:", errorData);
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: 500 }
      );
    }

    const data = await airtableResponse.json();

    return NextResponse.json(
      { success: true, message: "Successfully subscribed to newsletter!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}


