import { AppBlock, events } from "@slflows/sdk/v1";
import { segmentApiCall } from "../main";

export const trackEvent: AppBlock = {
  name: "Track Event",
  category: "Analytics",
  description:
    "Send behavioral events to Segment (e.g., order completed, button clicked)",
  config: {},

  inputs: {
    default: {
      config: {
        userId: {
          name: "User ID",
          description:
            "The user ID to associate with this event (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        anonymousId: {
          name: "Anonymous ID",
          description:
            "The anonymous ID to associate with this event (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        event: {
          name: "Event Name",
          description:
            "The name of the event to track (e.g., 'Order Completed', 'Button Clicked')",
          type: "string",
          required: false,
        },
        properties: {
          name: "Properties",
          description: "Event properties as JSON object (optional)",
          type: {
            type: "object",
            additionalProperties: true,
          },
          required: false,
        },
        context: {
          name: "Context",
          description:
            "Additional context information as JSON object (optional)",
          type: {
            type: "object",
            additionalProperties: true,
          },
          required: false,
        },
        timestamp: {
          name: "Timestamp",
          description:
            "Event timestamp (ISO 8601 format, optional - defaults to current time)",
          type: "string",
          required: false,
        },
      },
      onEvent: async ({ app, event }) => {
        const {
          userId,
          anonymousId,
          event: eventName,
          properties,
          context,
          timestamp,
        } = event.inputConfig;

        // Validate that either userId or anonymousId is provided
        if (!userId && !anonymousId) {
          throw new Error("Either userId or anonymousId must be provided");
        }

        const dataPlaneUrl = app.config.dataPlaneUrl || "api.segment.io";
        const writeKey = app.config.writeKey;

        const payload: any = {
          properties: properties || {},
          context: context || {},
        };

        if (eventName) payload.event = eventName;
        if (userId) payload.userId = userId;
        if (anonymousId) payload.anonymousId = anonymousId;
        if (timestamp) payload.timestamp = timestamp;

        await segmentApiCall("track", payload, writeKey, dataPlaneUrl);

        await events.emit({
          success: true,
          eventName: eventName || null,
          userId: userId || null,
          anonymousId: anonymousId || null,
          timestamp: timestamp || new Date().toISOString(),
        });
      },
    },
  },

  outputs: {
    default: {
      default: true,
      possiblePrimaryParents: ["default"],
      type: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            description: "Whether the event was successfully tracked",
          },
          eventName: {
            type: "string",
            description: "The name of the tracked event",
          },
          userId: {
            type: "string",
            description: "The user ID associated with the event",
          },
          anonymousId: {
            type: "string",
            description: "The anonymous ID associated with the event",
          },
          timestamp: {
            type: "string",
            description: "The timestamp of the event",
          },
        },
        required: ["success", "timestamp"],
      },
    },
  },
};
