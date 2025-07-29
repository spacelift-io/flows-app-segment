import { AppBlock, events } from "@slflows/sdk/v1";
import { segmentApiCall } from "../main";

export const identifyUser: AppBlock = {
  name: "Identify User",
  category: "Analytics",
  description:
    "Associate user traits with a user ID in Segment (e.g., name, email, company)",
  config: {},

  inputs: {
    default: {
      config: {
        userId: {
          name: "User ID",
          description:
            "The user ID to identify (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        anonymousId: {
          name: "Anonymous ID",
          description:
            "The anonymous ID to identify (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        traits: {
          name: "Traits",
          description: `User traits as JSON object (e.g., {"name": "John Doe", "email": "john@example.com"})"`,
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
            "Identification timestamp (ISO 8601 format, optional - defaults to current time)",
          type: "string",
          required: false,
        },
      },
      onEvent: async ({ app, event }) => {
        const { userId, anonymousId, traits, context, timestamp } =
          event.inputConfig;

        // Validate that either userId or anonymousId is provided
        if (!userId && !anonymousId) {
          throw new Error("Either userId or anonymousId must be provided");
        }

        const dataPlaneUrl = app.config.dataPlaneUrl || "api.segment.io";
        const writeKey = app.config.writeKey;

        const payload: any = {
          traits: traits || {},
          context: context || {},
        };

        if (userId) payload.userId = userId;
        if (anonymousId) payload.anonymousId = anonymousId;
        if (timestamp) payload.timestamp = timestamp;

        await segmentApiCall("identify", payload, writeKey, dataPlaneUrl);

        await events.emit({
          success: true,
          userId: userId || null,
          anonymousId: anonymousId || null,
          traits: traits || {},
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
            description: "Whether the user was successfully identified",
          },
          userId: {
            type: "string",
            description: "The user ID that was identified",
          },
          anonymousId: {
            type: "string",
            description: "The anonymous ID that was identified",
          },
          traits: {
            type: "object",
            description: "The traits that were associated with the user",
          },
          timestamp: {
            type: "string",
            description: "The timestamp of the identification",
          },
        },
        required: ["success", "traits", "timestamp"],
      },
    },
  },
};
