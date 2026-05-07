import { subscribeUser } from "@/lib/mailchimp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, fullName, phone } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await subscribeUser({ email, fullName, phone });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mailchimp subscribe API error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe user" },
      { status: 500 }
    );
  }
}