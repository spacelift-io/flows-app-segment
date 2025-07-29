import { AppBlock, events } from "@slflows/sdk/v1";
import { segmentApiCall } from "../main";

export const pageView: AppBlock = {
  name: "Page View",
  category: "Analytics",
  description: "Record page or screen views in Segment",
  config: {},

  inputs: {
    default: {
      config: {
        userId: {
          name: "User ID",
          description:
            "The user ID to associate with this page view (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        anonymousId: {
          name: "Anonymous ID",
          description:
            "The anonymous ID to associate with this page view (either userId or anonymousId is required)",
          type: "string",
          required: false,
        },
        name: {
          name: "Page Name",
          description: "The name of the page (optional)",
          type: "string",
          required: false,
        },
        category: {
          name: "Page Category",
          description: "The category of the page (optional)",
          type: "string",
          required: false,
        },
        properties: {
          name: "Properties",
          description: `Page properties as JSON object (e.g., {"url": "https://example.com/page", "title": "Page Title"})`,
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
            "Page view timestamp (ISO 8601 format, optional - defaults to current time)",
          type: "string",
          required: false,
        },
      },
      onEvent: async ({ app, event }) => {
        const {
          userId,
          anonymousId,
          name,
          category,
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

        if (userId) payload.userId = userId;
        if (anonymousId) payload.anonymousId = anonymousId;
        if (name) payload.name = name;
        if (category) payload.category = category;
        if (timestamp) payload.timestamp = timestamp;

        await segmentApiCall("page", payload, writeKey, dataPlaneUrl);

        await events.emit({
          success: true,
          pageName: name || null,
          pageCategory: category || null,
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
            description: "Whether the page view was successfully recorded",
          },
          pageName: {
            type: "string",
            description: "The name of the page that was viewed",
          },
          pageCategory: {
            type: "string",
            description: "The category of the page that was viewed",
          },
          userId: {
            type: "string",
            description: "The user ID associated with the page view",
          },
          anonymousId: {
            type: "string",
            description: "The anonymous ID associated with the page view",
          },
          timestamp: {
            type: "string",
            description: "The timestamp of the page view",
          },
        },
        required: ["success", "timestamp"],
      },
    },
  },
};
