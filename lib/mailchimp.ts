import mailchimp from "@mailchimp/mailchimp_marketing";

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

export interface MailchimpSubscriber {
  email: string;
  fullName?: string;
  phone?: string;
}

/**
 * Subscribe a user to Mailchimp audience
 * Updates existing subscriber if already exists
 */
export async function subscribeUser(subscriber: MailchimpSubscriber): Promise<void> {
  try {
    const { email, fullName, phone } = subscriber;

    // Check if subscriber already exists
    let existingSubscriber;
    try {
      existingSubscriber = await mailchimp.lists.getListMember(
        MAILCHIMP_AUDIENCE_ID,
        email.toLowerCase()
      );
    } catch (error: any) {
      // If error is not "member not found", rethrow
      if (error.status !== 404) {
        throw error;
      }
    }

    const subscriberData = {
      email_address: email.toLowerCase(),
      status: existingSubscriber ? existingSubscriber.status : "subscribed",
      merge_fields: {
        ...(fullName && { FNAME: fullName.split(' ')[0], LNAME: fullName.split(' ').slice(1).join(' ') }),
        ...(phone && { PHONE: phone }),
      },
    };

    if (existingSubscriber) {
      // Update existing subscriber
      await mailchimp.lists.updateListMember(
        MAILCHIMP_AUDIENCE_ID,
        email.toLowerCase(),
        subscriberData
      );
    } else {
      // Add new subscriber
      await mailchimp.lists.addListMember(
        MAILCHIMP_AUDIENCE_ID,
        subscriberData
      );
    }
  } catch (error) {
    console.error("Mailchimp subscribeUser error:", error);
    throw new Error("Failed to subscribe user to Mailchimp");
  }
}

/**
 * Add a tag to a Mailchimp subscriber
 */
export async function addTag(email: string, tag: string): Promise<void> {
  try {
    await mailchimp.lists.updateListMemberTags(
      MAILCHIMP_AUDIENCE_ID,
      email.toLowerCase(),
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
      MAILCHIMP_AUDIENCE_ID,
      email.toLowerCase(),
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
      MAILCHIMP_AUDIENCE_ID,
      email.toLowerCase()
    );

    return member.tags?.map((tag: any) => tag.name) || [];
  } catch (error) {
    console.error(`Mailchimp getSubscriberTags error for ${email}:`, error);
    return [];
  }
}