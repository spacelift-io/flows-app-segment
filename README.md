# Segment - Flows App

A Flows app for integrating with Segment analytics platform. Send tracking events, identify users, and record page views directly from your Flows workflows.

## Features

- **Track Events**: Send behavioral events to Segment (e.g., order completed, button clicked)
- **Identify Users**: Associate user traits with user IDs (e.g., name, email, company)
- **Page Views**: Record page or screen views in Segment
- **Flexible Identification**: Support both user IDs and anonymous IDs
- **Custom Data Plane**: Optional custom Segment data plane URL support
- **Automatic Connection Testing**: Built-in validation of Segment credentials

## Configuration

### Required Settings

- **Segment Write Key**: Your Segment source Write Key (sensitive)

### Optional Settings

- **Data Plane URL**: Custom Segment data plane URL (defaults to `api.segment.io`)

## Installation

1. **Get Write Key**: Visit your Segment source settings and copy the Write Key
2. **Configure**: Paste your Write Key in the 'Segment Write Key' field
3. **Confirm**: Click 'Confirm' to complete the installation

The app will automatically test your connection to ensure the Write Key is valid.

## Available Blocks

### Track Event

Send behavioral events to Segment for analytics tracking.

**Inputs:**

- User ID or Anonymous ID (at least one required)
- Event Name (e.g., "Order Completed", "Button Clicked")
- Properties (optional JSON object)
- Context (optional JSON object)
- Timestamp (optional ISO 8601 format)

**Outputs:**

- Success status
- Event name
- User/Anonymous ID
- Timestamp

### Identify User

Associate user traits with a user ID in Segment.

**Inputs:**

- User ID or Anonymous ID (at least one required)
- Traits (JSON object with user attributes like name, email)
- Context (optional JSON object)
- Timestamp (optional ISO 8601 format)

**Outputs:**

- Success status
- User/Anonymous ID
- Traits
- Timestamp

### Page View

Record page or screen views in Segment.

**Inputs:**

- User ID or Anonymous ID (at least one required)
- Page Name (optional)
- Page Category (optional)
- Properties (optional JSON object with URL, title, etc.)
- Context (optional JSON object)
- Timestamp (optional ISO 8601 format)

**Outputs:**

- Success status
- Page name and category
- User/Anonymous ID
- Timestamp

## Usage Examples

### Track a Purchase Event

```json
{
  "userId": "user123",
  "event": "Order Completed",
  "properties": {
    "orderId": "order456",
    "revenue": 99.99,
    "currency": "USD",
    "products": ["shirt", "pants"]
  }
}
```

### Identify a New User

```json
{
  "userId": "user123",
  "traits": {
    "name": "John Doe",
    "email": "john@example.com",
    "company": "Acme Corp",
    "plan": "premium"
  }
}
```

### Record a Page View

```json
{
  "userId": "user123",
  "name": "Product Page",
  "category": "E-commerce",
  "properties": {
    "url": "https://example.com/products/123",
    "title": "Amazing Product - Acme Store",
    "referrer": "https://google.com"
  }
}
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
npm install
```

### Available Scripts

- `npm run typecheck` - Type check the code
- `npm run format` - Format code with Prettier
- `npm run bundle` - Bundle the app for deployment

### Project Structure

```
segment-app/
├── blocks/
│   ├── trackEvent.ts     # Track events block
│   ├── identifyUser.ts   # Identify users block
│   └── pageView.ts       # Page view block
├── main.ts               # App definition and API utilities
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## API Reference

The app uses Segment's HTTP Tracking API v1. All blocks share a common API utility function that handles:

- Authentication with Write Key
- Base64 encoding for HTTP Basic Auth
- Error handling and response validation
- Support for custom data plane URLs

## Error Handling

All blocks validate inputs and provide clear error messages:

- Missing user/anonymous ID validation
- API response error handling
- Network error handling
- Invalid timestamp format detection

## Security

- Write Key is marked as sensitive and encrypted at rest
- Uses HTTPS for all API communications
- No sensitive data logged in error messages
- Basic Auth header properly encoded

## Support

For issues with this Flows app, please check:

1. Your Segment Write Key is correct
2. Your Segment source is active
3. Network connectivity to Segment's API
4. Custom data plane URL is accessible (if configured)

For Segment-specific questions, refer to the [Segment documentation](https://segment.com/docs/).
