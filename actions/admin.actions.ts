"use server";

import { backendClient } from "@/sanity/lib/backendClient";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ── Actions available to admin ────────────────────────────────────────────────
export async function updateOrderStatus(
  orderId: string,
  field: "status" | "paymentStatus",
  value: string,
) {
  await backendClient
    .patch(orderId)
    .set({ [field]: value })
    .commit();
  revalidatePath("/admin/orders");
}

export async function deleteOrder(orderId: string) {
  await backendClient.delete(orderId);
  revalidatePath("/admin/orders");
}

export async function deleteUser(userId: string) {
  const clerk = await clerkClient();
  await clerk.users.deleteUser(userId);
  revalidatePath("/admin/users");
}

export async function deleteUsers(userIds: string[]) {
  const clerk = await clerkClient();
  for (const id of userIds) {
    try {
      await clerk.users.deleteUser(id);
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
    }
  }
  revalidatePath("/admin/users");
}

export async function deleteOrders(orderIds: string[]) {
  const transaction = backendClient.transaction();
  orderIds.forEach((id) => {
    transaction.delete(id);
  });
  await transaction.commit();
  revalidatePath("/admin/orders");
}
