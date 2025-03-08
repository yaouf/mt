# Authors API Documentation

This document provides details on how to use the Firebase author-related endpoints in the BDH Mobile App.

## Overview

The Authors API allows users to:

- Check if an author exists
- Subscribe to an author to receive notifications about their articles
- Unsubscribe from an author
- Get a list of authors a device is subscribed to

## Endpoints

### 1. Check if an Author Exists

**Endpoint:** `authorExists`

**Method:** GET

**Query Parameters:**

- `slug` (optional): The author's URL slug (just the suffix i.e. jakobi-haskell)
- `id` (optional): The author's ID
- `name` (optional): The author's name (supports partial matching)

**Note:** At least one of the parameters must be provided.

**Response:**

```json
{
  "success": true,
  "exists": true,
  "authors": [
    {
      "id": 123,
      "name": "John Doe",
      "slug": "john-doe"
    }
  ],
  "message": "Author(s) found"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "At least one search parameter (slug, id, or name) is required"
}
```

**Example Usage:**

```typescript
const response = await fetch(
  "https://us-central1-bdh-mobile-app---dev.cloudfunctions.net/authorExists?slug=john-smith",
  {
    method: "GET"
  }
);
const data = await response.json();
```

### 2. Subscribe to an Author

**Endpoint:** `subscribeAuthor`

**Method:** POST

**Request Body:**

```json
{
  "deviceId": "device-uuid-here",
  "authorId": 123
}
```

**Response:**

```json
{
  "success": true,
  "message": "Subscribed to author successfully",
  "subscription": {
    "id": 456,
    "deviceId": "device-uuid-here",
    "authorId": 123,
    "dateCreated": "2025-03-08T16:30:00.000Z"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Both deviceId and authorId are required"
}
```

```json
{
  "success": false,
  "message": "Device not found"
}
```

```json
{
  "success": false,
  "message": "Author not found"
}
```

```json
{
  "success": false,
  "message": "Subscription already exists",
  "subscription": {
    "id": 456,
    "deviceId": "device-uuid-here",
    "authorId": 123,
    "dateCreated": "2025-03-08T16:30:00.000Z"
  }
}
```

**Example Usage:**

```typescript
const response = await fetch(
  "https://us-central1-bdh-mobile-app---dev.cloudfunctions.net/subscribeAuthor",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      deviceId: "device-uuid-here",
      authorId: 123
    })
  }
);
const data = await response.json();
```

### 3. Unsubscribe from an Author

**Endpoint:** `unsubscribeAuthor`

**Method:** POST

**Request Body:**

```json
{
  "deviceId": "device-uuid-here",
  "authorId": 123
}
```

**Response:**

```json
{
  "success": true,
  "message": "Unsubscribed from author successfully"
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Both deviceId and authorId are required"
}
```

```json
{
  "success": false,
  "message": "Subscription not found"
}
```

**Example Usage:**

```typescript
const response = await fetch(
  "https://us-central1-bdh-mobile-app---dev.cloudfunctions.net/unsubscribeAuthor",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      deviceId: "device-uuid-here",
      authorId: 123
    })
  }
);
const data = await response.json();
```

### 4. Get Device's Subscribed Authors

**Endpoint:** `getDeviceAuthors`

**Method:** POST

**Request Body:**

```json
{
  "deviceId": "device-uuid-here"
}
```

**Response:**

```json
{
  "success": true,
  "authors": [
    {
      "id": 123,
      "name": "John Doe",
      "slug": "john-doe",
      "dateCreated": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 456,
      "name": "Jane Smith",
      "slug": "jane-smith",
      "dateCreated": "2025-01-02T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "DeviceId is required"
}
```

```json
{
  "success": false,
  "message": "Device not found"
}
```

**Example Usage:**

```typescript
const response = await fetch(
  "https://us-central1-bdh-mobile-app---dev.cloudfunctions.net/getDeviceAuthors",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      deviceId: "device-uuid-here"
    })
  }
);
const data = await response.json();
```

## Integration with Frontend

## Error Handling

All endpoints follow a consistent error handling pattern:

1. HTTP status codes indicate the type of error:
   - 400: Bad Request (missing or invalid parameters)
   - 404: Not Found (resource doesn't exist)
   - 409: Conflict (e.g., subscription already exists)
   - 500: Internal Server Error

2. Response body for errors always includes:
   - `success: false`
   - `message`: A descriptive error message

## To Do (Frontend)

- Store device author notifs in async local storage
- Allow users to edit their notif preferences somewhere in settings
- Allow users to subscribe to specific authors from their article page (if the author exists)

## Environment URLs

- Development: `https://us-central1-bdh-mobile-app---dev.cloudfunctions.net/`
- Production: `https://us-central1-bdh-mobile-app---prod.cloudfunctions.net/`

Always use the appropriate environment URL based on your build configuration.
