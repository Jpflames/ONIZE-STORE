import mailchimp from "@mailchimp/mailchimp_marketing";
import { createHash } from "crypto";

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

if (!MAILCHIMP_API_KEY || !MAILCHIMP_SERVER_PREFIX || !MAILCHIMP_AUDIENCE_ID) {
  throw new Error("Mailchimp environment variables are not configured");
}

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX,
});

export const MAILCHIMP_TAGS = {
  newCustomer: "new_customer",
  purchased: "purchased",
  abandonedCart: "abandoned_cart",
} as const;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function getSubscriberHash(email: string): string {
  return createHash("md5").update(normalizeEmail(email)).digest("hex");
}

function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

export interface MailchimpSubscriber {
  email: string;
  fullName?: string;
  phone?: string;
}

export async function syncSubscriberToMailchimp(
  subscriber: MailchimpSubscriber,
  tags: string[] = [MAILCHIMP_TAGS.newCustomer],
): Promise<void> {
  try {
    const email = normalizeEmail(subscriber.email);

    if (!email || !isValidEmail(email)) {
      throw new Error("Invalid email address");
    }

    const subscriberHash = getSubscriberHash(email);
    const merge_fields = {
      ...(subscriber.fullName ? { FNAME: subscriber.fullName } : {}),
      ...(subscriber.phone ? { PHONE: subscriber.phone } : {}),
    };

    const payload = {
      email_address: email,
      status_if_new: "subscribed" as const,
      merge_fields,
      ...(tags.length > 0 && { tags }),
    };

    await mailchimp.lists.setListMember(
      MAILCHIMP_AUDIENCE_ID!,
      subscriberHash,
      payload as any,
    );
  } catch (error) {
    console.error("Mailchimp syncSubscriberToMailchimp error:", error);
    throw new Error("Failed to sync subscriber to Mailchimp");
  }
}

/**
 * Subscribe a user to Mailchimp audience
 * Updates existing subscriber if already exists
 */
export async function subscribeUser(subscriber: MailchimpSubscriber): Promise<void> {
  return syncSubscriberToMailchimp(subscriber, []);
}

/**
 * Add a tag to a Mailchimp subscriber
 */
export async function addTag(email: string, tag: string): Promise<void> {
  try {
    await mailchimp.lists.updateListMemberTags(
      MAILCHIMP_AUDIENCE_ID!,
      normalizeEmail(email),
      {
        tags: [{ name: tag, status: "active" }],
      }
    );
  } catch (error) {
    console.error(`Mailchimp addTag error for ${email} with tag ${tag}:`, error);
    throw new Error(`Failed to add tag ${tag} to subscriber`);
  }
}

/**
 * Remove a tag from a Mailchimp subscriber
 */
export async function removeTag(email: string, tag: string): Promise<void> {
  try {
    await mailchimp.lists.updateListMemberTags(
      MAILCHIMP_AUDIENCE_ID!,
      normalizeEmail(email),
      {
        tags: [{ name: tag, status: "inactive" }],
      }
    );
  } catch (error) {
    console.error(`Mailchimp removeTag error for ${email} with tag ${tag}:`, error);
    throw new Error(`Failed to remove tag ${tag} from subscriber`);
  }
}

/**
 * Get subscriber tags
 */
export async function getSubscriberTags(email: string): Promise<string[]> {
  try {
    const member = await mailchimp.lists.getListMember(
      MAILCHIMP_AUDIENCE_ID!,
      normalizeEmail(email)
    );

    // Type guard to check if it's a successful response
    if ('tags' in member) {
      return member.tags?.map((tag: any) => tag.name) || [];
    }
    return [];
  } catch (error) {
    console.error(`Mailchimp getSubscriberTags error for ${email}:`, error);
    return [];
  }
}