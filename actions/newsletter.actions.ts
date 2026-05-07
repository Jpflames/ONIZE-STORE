"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { subscribeUser } from "@/lib/mailchimp";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(email: string) {
  try {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return { success: false, error: "Invalid email address." };
    }

    // Check if the user is already subscribed in Sanity
    const existingSubscriber = await backendClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email },
    );

    if (existingSubscriber) {
      return { success: false, error: "This email is already subscribed!" };
    }

    // Subscribe to Mailchimp
    try {
      await subscribeUser({ email });
    } catch (error) {
      console.error("Failed to subscribe to Mailchimp:", error);
      // Continue with Sanity subscription even if Mailchimp fails
    }

    // Create a new subscriber document in Sanity
    await backendClient.create({
      _type: "subscriber",
      email,
      subscribedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to subscribe:", error);
    return {
      success: false,
      error: "Internal server error. Please try again.",
    };
  }
}

export async function deleteSubscribers(subscriberIds: string[]) {
  try {
    // Perform bulk delete using Sanity transaction or multiple sequential deletions
    const transaction = backendClient.transaction();

    for (const id of subscriberIds) {
      transaction.delete(id);
    }

    await transaction.commit();
    revalidatePath("/admin/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscribers:", error);
    return { success: false, error: "Failed to delete subscribers." };
  }
}
