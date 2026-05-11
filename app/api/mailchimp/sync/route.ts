import { backendClient } from "@/sanity/lib/backendClient";
import { MAILCHIMP_TAGS, syncSubscriberToMailchimp } from "@/lib/mailchimp";
import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SanitySubscriber {
  email?: string;
  fullName?: string;
}

export async function POST() {
  try {
    const subscribers = await backendClient.fetch<SanitySubscriber[]>(
      `*[_type == "subscriber"]{ email, fullName }`
    );

    const failed: Array<{ email: string; error: string }> = [];
    let totalSynced = 0;

    for (const subscriber of subscribers) {
      const email = subscriber.email?.trim().toLowerCase() ?? "";

      if (!email || !EMAIL_REGEX.test(email)) {
        failed.push({
          email: subscriber.email ?? "invalid",
          error: "Invalid email address",
        });
        continue;
      }

      try {
        await syncSubscriberToMailchimp(
          { email, fullName: subscriber.fullName },
          [MAILCHIMP_TAGS.newCustomer],
        );
        totalSynced += 1;
      } catch (error: any) {
        console.error(`Failed to sync subscriber ${email}:`, error);
        failed.push({
          email,
          error: error?.message ?? "Unknown Mailchimp sync error",
        });
      }
    }

    return NextResponse.json({
      success: failed.length === 0,
      totalSynced,
      failed,
    });
  } catch (error) {
    console.error("Mailchimp sync API error:", error);
    return NextResponse.json(
      {
        success: false,
        totalSynced: 0,
        failed: [],
        error: "Failed to sync subscribers",
      },
      { status: 500 },
    );
  }
}
