import axios from "axios";

interface Notification {
  id: number;
  title: string;
  message: string;
  image?: { url: string };
  target_url?: string;
  state: "pending" | "sent" | "failed";
  sent_at?: Date;
  onesignal_id?: string;
  is_sent: boolean;
  publishedAt?: Date;
}

module.exports = {
  async afterCreate(event: { result: Notification }) {
    const { result } = event;

    // Check if the notification state is 'pending' and it is published
    if (result.state === "pending" && result.publishedAt) {
      try {
        const response = await sendNotification(result);

        // Update the notification state to 'sent' and log the OneSignal ID
        await strapi.db.query("api::notification.notification").update({
          where: { id: result.id },
          data: {
            state: "sent",
            sent_at: new Date(),
            onesignal_id: response.data.id,
            is_sent: true,
          },
        });
        strapi.log.info(`Notification sent successfully: ${response.data.id}`);
      } catch (error) {
        strapi.log.error("Failed to send notification", error);

        // Update the notification state to 'failed'
        await strapi.db.query("api::notification.notification").update({
          where: { id: result.id },
          data: { state: "failed" },
        });
      }
    }
  },
};

// Helper function to send the notification via OneSignal
async function sendNotification(notification: Notification) {
  const onesignalUrl = "https://onesignal.com/api/v1/notifications";
  const appId = process.env.ONESIGNAL_APP_ID; // Read from environment variables
  const apiKey = process.env.ONESIGNAL_API_KEY; // Read from environment variables

  if (!appId || !apiKey) {
    throw new Error("OneSignal credentials are not properly configured in the environment variables.");
  }

  const data: any = {
    app_id: appId,
    contents: { en: notification.message },
    headings: { en: notification.title },
    included_segments: ["All"], // Customize this if needed
    ios_badgeType: "Increase",
    ios_badgeCount: 1,
    content_available: true,
    data: { type: "Notification Admin" },
  };

  if (notification.target_url) {
    data.url = notification.target_url;
  }

  if (notification.image && notification.image.url) {
    data.ios_attachments = { img: notification.image.url };
    data.big_picture = notification.image.url;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${apiKey}`,
  };

  try {
    return await axios.post(onesignalUrl, data, { headers });
  } catch (error: any) {
    if (error.response) {
      strapi.log.error(
        `OneSignal API Error: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`
      );
    }
    throw error;
  }
}
