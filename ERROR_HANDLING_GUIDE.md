# Bad Request Error Handling Guide

## Overview

This guide helps you diagnose and fix `ERROR_BAD_REQUEST` errors in your application.

## Common Causes of Bad Request Errors

### 1. **Invalid Request Payload**
- **Problem**: Sending `undefined` values, circular references, or malformed JSON
- **Solution**: Use the `validateRequestPayload()` function before sending requests
- **Example**:
  ```typescript
  const validation = validateRequestPayload(payload)
  if (!validation.isValid) {
    console.error(validation.error)
    return
  }
  ```

### 2. **Missing Required Fields**
- **Problem**: API expects certain fields but they're missing or null
- **Solution**: Check API documentation and ensure all required fields are present
- **Example**:
  ```typescript
  const payload = {
    teamAssignments: teamAssignments, // Required
    athleteStatuses: athleteStatuses, // Required
    // Don't include undefined fields
  }
  ```

### 3. **Incorrect Content-Type Header**
- **Problem**: Sending JSON without proper `Content-Type` header
- **Solution**: The `makeApiRequest()` function automatically sets this, but if using raw fetch:
  ```typescript
  headers: {
    "Content-Type": "application/json"
  }
  ```

### 4. **Invalid Data Types**
- **Problem**: Sending strings where numbers are expected, or vice versa
- **Solution**: Validate and convert data types before sending
  ```typescript
  const payload = {
    id: Number(teamId), // Convert string to number if needed
    name: String(name), // Ensure it's a string
  }
  ```

### 5. **Request Size Limits**
- **Problem**: Payload too large for the API
- **Solution**: Batch requests or paginate data
  ```typescript
  // Instead of sending all at once, batch:
  const batches = chunkArray(largeArray, 100)
  for (const batch of batches) {
    await makeApiRequest(url, { method: "POST", body: JSON.stringify(batch) })
  }
  ```

## Using the Error Handler

### Basic Usage

```typescript
import { makeApiRequest, getUserFriendlyErrorMessage } from "@/lib/api-error-handler"

try {
  const result = await makeApiRequest("/api/endpoint", {
    method: "POST",
    body: JSON.stringify({ data: "value" }),
  })
  console.log("Success:", result)
} catch (error) {
  const message = getUserFriendlyErrorMessage(error)
  toast.error("Request failed", { description: message })
}
```

### With Validation

```typescript
import { validateRequestPayload, makeApiRequest } from "@/lib/api-error-handler"

const payload = { teamAssignments, athleteStatuses }

// Validate before sending
const validation = validateRequestPayload(payload)
if (!validation.isValid) {
  toast.error("Invalid data", { description: validation.error })
  return
}

// Then make the request
try {
  await makeApiRequest("/api/save", {
    method: "POST",
    body: JSON.stringify(payload),
  })
} catch (error) {
  // Error is automatically parsed and formatted
  toast.error(getUserFriendlyErrorMessage(error))
}
```

## Debugging Bad Request Errors

### 1. Check the Request Payload

```typescript
console.log("Payload:", JSON.stringify(payload, null, 2))
```

### 2. Check Network Tab
- Open browser DevTools → Network tab
- Find the failed request
- Check the Request Payload section
- Verify it matches what the API expects

### 3. Check API Documentation
- Verify required fields
- Check data type requirements
- Look for size limits or constraints

### 4. Test with a Minimal Payload

```typescript
// Start with minimal valid payload
const minimalPayload = {
  // Only required fields
}

// If that works, gradually add more fields
```

## Error Response Format

The error handler expects this format:

```typescript
{
  error: "ERROR_BAD_REQUEST",
  details: {
    title: "Bad request.",
    detail: "Bad Request",
    isRetryable: false,
    additionalInfo: {
      // Additional error details
    }
  }
}
```

## Environment Variables

Make sure your API URL is configured:

```env
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

Or set it in your code:

```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/save-assignments"
```

## Retry Logic

For retryable errors (network issues, 5xx errors):

```typescript
async function makeRequestWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await makeApiRequest(url, options)
    } catch (error) {
      const apiError = parseApiError(error)
      if (!apiError.isRetryable || i === maxRetries - 1) {
        throw error
      }
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

## Best Practices

1. **Always validate payloads** before sending
2. **Use TypeScript types** to catch errors at compile time
3. **Handle errors gracefully** with user-friendly messages
4. **Log errors** for debugging (but don't expose sensitive info)
5. **Test with invalid data** to ensure proper error handling
6. **Check API documentation** for required fields and formats

## Quick Checklist

When you get a bad request error:

- [ ] Check if payload contains `undefined` values
- [ ] Verify all required fields are present
- [ ] Check data types match API expectations
- [ ] Ensure JSON is valid (no circular references)
- [ ] Check Content-Type header is set
- [ ] Verify API endpoint URL is correct
- [ ] Check request size isn't too large
- [ ] Review API documentation for requirements
- [ ] Test with minimal payload first

