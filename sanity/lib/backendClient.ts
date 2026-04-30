import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error(
    "Missing SANITY_API_TOKEN. Create a Sanity API token with write access and set it in your .env/.env.local.",
  );
}

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // This client is used for authenticated server actions + mutations.
  // Using the CDN can return stale data right after writes (e.g. address save),
  // so we disable it to ensure UI reflects changes immediately.
  useCdn: false,
  token,
});
