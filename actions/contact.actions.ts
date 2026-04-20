"use server";

import { backendClient } from "@/sanity/lib/backendClient";

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const { name, email, message } = data;

    if (!name || !email || !message) {
      throw new Error("All fields are required.");
    }

    const res = await backendClient.create({
      _type: "contact",
      name,
      email,
      message,
    });

    return { success: true, id: res._id };
  } catch (error) {
    console.error("Error creating contact message:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}
