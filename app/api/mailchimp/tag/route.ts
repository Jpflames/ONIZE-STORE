import { addTag, removeTag } from "@/lib/mailchimp";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, tag, action } = body;

    if (!email || !tag) {
      return NextResponse.json(
        { error: "Email and tag are required" },
        { status: 400 }
      );
    }

    if (action === "remove") {
      await removeTag(email, tag);
    } else {
      await addTag(email, tag);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mailchimp tag API error:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}