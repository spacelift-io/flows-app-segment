import { defineApp } from "@slflows/sdk/v1";
import { trackEvent } from "./blocks/trackEvent";
import { identifyUser } from "./blocks/identifyUser";
import { pageView } from "./blocks/pageView";

export async function segmentApiCall(
  endpoint: string,
  payload: any,
  writeKey: string,
  dataPlaneUrl: string = "api.segment.io",
): Promise<void> {
  const response = await fetch(`https://${dataPlaneUrl}/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(writeKey + ":").toString("base64")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Segment API error: ${response.status} - ${errorText}`);
  }
}

export const app = defineApp({
  name: "Segment",
  installationInstructions:
    "To connect your Segment account:\n1. **Get Write Key**: Visit your Segment source settings and copy the Write Key\n2. **Configure**: Paste your Write Key in the 'Segment Write Key' field below\n3. **Confirm**: Click 'Confirm' to complete the installation",
  config: {
    writeKey: {
      name: "Segment Write Key",
      description: "Your Segment source Write Key",
      type: "string",
      required: true,
      sensitive: true,
    },
    dataPlaneUrl: {
      name: "Data Plane URL",
      description:
        "Custom Segment data plane URL (optional, defaults to api.segment.io)",
      type: "string",
      required: false,
      default: "api.segment.io",
    },
  },
  blocks: {
    trackEvent,
    identifyUser,
    pageView,
  },
  async onSync(input) {
    const { writeKey } = input.app.config;

    if (!writeKey) {
      console.error("Segment Write Key is required");
      return {
        newStatus: "failed",
        customStatusDescription: "Check logs for details",
      };
    }

    try {
      // Test the connection by making a simple HTTP request to Segment's API
      const response = await fetch(
        `https://${input.app.config.dataPlaneUrl || "api.segment.io"}/v1/track`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(writeKey + ":").toString("base64")}`,
          },
          body: JSON.stringify({
            userId: "test",
            event: "App Sync Test",
            properties: {
              test: true,
            },
          }),
        },
      );

      if (response.ok || response.status === 200) {
        return { newStatus: "ready" };
      } else {
        console.error(`Segment API returned status ${response.status}`);
        return {
          newStatus: "failed",
          customStatusDescription: "Check logs for details",
        };
      }
    } catch (error) {
      console.error("Failed to validate Segment Write Key: ", error);

      return {
        newStatus: "failed",
        customStatusDescription: "Check logs for details",
      };
    }
  },
});
