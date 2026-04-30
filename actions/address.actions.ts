"use server";

import { backendClient } from "@/sanity/lib/backendClient";

export interface AddressData {
  clerkUserId: string;
  email: string;
  fullName: string;
  addressType: "home" | "work" | "others";
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}

export const getUserAddresses = async (clerkUserId: string) => {
  const QUERY = `*[_type == "address" && clerkUserId == $clerkUserId] | order(isDefault desc, _createdAt desc)`;
  try {
    const addresses = await backendClient.fetch(QUERY, { clerkUserId });
    return addresses || [];
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }
};

export const addUserAddress = async (data: AddressData) => {
  try {
    // If this is the first address, make it default
    const existingAddresses = await getUserAddresses(data.clerkUserId);
    const isDefault = existingAddresses.length === 0 ? true : !!data.isDefault;

    // If setting as default, unset other defaults
    if (isDefault) {
      const defaultAddresses = existingAddresses.filter(
        (addr: any) => addr.isDefault,
      );
      for (const addr of defaultAddresses) {
        await backendClient.patch(addr._id).set({ isDefault: false }).commit();
      }
    }

    const newAddress = await backendClient.create({
      _type: "address",
      ...data,
      isDefault,
    });

    return { success: true, address: newAddress };
  } catch (error) {
    console.error("Error adding user address:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Failed to add address";
    return { success: false, error: message };
  }
};

export const setDefaultAddress = async (
  addressId: string,
  clerkUserId: string,
) => {
  try {
    const existingAddresses = await getUserAddresses(clerkUserId);

    // Unset all defaults for this user
    for (const addr of existingAddresses) {
      if (addr.isDefault) {
        await backendClient.patch(addr._id).set({ isDefault: false }).commit();
      }
    }

    // Set the new default
    await backendClient.patch(addressId).set({ isDefault: true }).commit();

    return { success: true };
  } catch (error) {
    console.error("Error setting default address:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Failed to set default address";
    return { success: false, error: message };
  }
};

export const updateUserAddress = async (
  addressId: string,
  data: Partial<AddressData>,
) => {
  try {
    const updatedAddress = await backendClient
      .patch(addressId)
      .set(data)
      .commit();

    return { success: true, address: updatedAddress };
  } catch (error) {
    console.error("Error updating user address:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Failed to update address";
    return { success: false, error: message };
  }
};

export const deleteUserAddress = async (addressId: string) => {
  try {
    await backendClient.delete(addressId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user address:", error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Failed to delete address";
    return { success: false, error: message };
  }
};
