/**
 * API Error Handler Utility
 * Handles various API error formats and provides user-friendly error messages
 */

export interface ApiErrorResponse {
  error: string
  details?: {
    title?: string
    detail?: string
    isRetryable?: boolean
    additionalInfo?: Record<string, unknown>
    buttons?: unknown[]
    planChoices?: unknown[]
  }
  isExpected?: boolean
  message?: string
}

export interface ApiError extends Error {
  status?: number
  statusText?: string
  response?: ApiErrorResponse
  isRetryable?: boolean
}

/**
 * Validates request payload before sending
 */
export function validateRequestPayload(payload: unknown): { isValid: boolean; error?: string } {
  if (payload === null || payload === undefined) {
    return { isValid: false, error: "Request payload cannot be null or undefined" }
  }

  if (typeof payload === "object") {
    // Check for common issues
    const obj = payload as Record<string, unknown>
    
    // Check for circular references (basic check)
    try {
      JSON.stringify(payload)
    } catch (error) {
      if (error instanceof Error && error.message.includes("circular")) {
        return { isValid: false, error: "Request payload contains circular references" }
      }
    }

    // Check for invalid values
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) {
        return { isValid: false, error: `Field "${key}" cannot be undefined. Use null or omit the field.` }
      }
    }
  }

  return { isValid: true }
}

/**
 * Creates an ApiError instance
 */
function createApiError(
  name: string,
  message: string,
  options?: {
    status?: number
    statusText?: string
    response?: ApiErrorResponse
    isRetryable?: boolean
  }
): ApiError {
  const error = new Error(message) as ApiError
  error.name = name
  if (options) {
    error.status = options.status
    error.statusText = options.statusText
    error.response = options.response
    error.isRetryable = options.isRetryable ?? false
  }
  return error
}

/**
 * Parses and formats API error responses
 */
export function parseApiError(error: unknown): ApiError {
  // Handle fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return createApiError(
      "NetworkError",
      "Network error: Unable to connect to the server. Please check your internet connection.",
      { isRetryable: true }
    )
  }

  // Handle Response objects
  if (error && typeof error === "object" && "status" in error && "json" in error) {
    const response = error as { status: number; statusText: string; json: () => Promise<ApiErrorResponse> }
    
    return createApiError(
      "ApiError",
      `API Error: ${response.status} ${response.statusText}`,
      {
        status: response.status,
        statusText: response.statusText,
        isRetryable: response.status >= 500 || response.status === 429,
      }
    )
  }

  // Handle error objects with response property
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as { response: ApiErrorResponse }
    const response = apiError.response

    if (response.error === "ERROR_BAD_REQUEST") {
      const detail = response.details?.detail || response.details?.title || "Bad Request"
      const message = response.details?.additionalInfo 
        ? `${detail}: ${JSON.stringify(response.details.additionalInfo)}`
        : detail

      return createApiError(
        "BadRequestError",
        message,
        {
          status: 400,
          statusText: "Bad Request",
          response: response,
          isRetryable: response.details?.isRetryable || false,
        }
      )
    }

    return createApiError(
      "ApiError",
      response.details?.detail || response.details?.title || response.error || "An unknown error occurred",
      {
        status: 400,
        response: response,
        isRetryable: response.details?.isRetryable || false,
      }
    )
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return createApiError(
      error.name,
      error.message,
      { isRetryable: false }
    )
  }

  // Fallback for unknown error types
  return createApiError(
    "UnknownError",
    typeof error === "string" ? error : "An unknown error occurred",
    { isRetryable: false }
  )
}

/**
 * Makes an API request with proper error handling
 */
export async function makeApiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Validate request body if present
  if (options.body) {
    try {
      const body = typeof options.body === "string" ? JSON.parse(options.body) : options.body
      const validation = validateRequestPayload(body)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }
      // Re-stringify if it was parsed
      if (typeof options.body !== "string") {
        options.body = JSON.stringify(body)
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Invalid JSON in request body")
      }
      throw error
    }
  }

  // Ensure proper headers
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json")
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Handle non-OK responses
    if (!response.ok) {
      let errorData: ApiErrorResponse
      try {
        errorData = await response.json()
      } catch {
        errorData = {
          error: "UNKNOWN_ERROR",
          details: {
            title: "Request Failed",
            detail: `HTTP ${response.status}: ${response.statusText}`,
            isRetryable: response.status >= 500 || response.status === 429,
          },
        }
      }

      // Parse the error response
      const apiError = parseApiError({ response: errorData })
      // Update status from the actual HTTP response
      apiError.status = response.status
      apiError.statusText = response.statusText
      throw apiError
    }

    // Parse successful response
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    }
    
    return (await response.text()) as unknown as T
  } catch (error) {
    // Re-throw parsed errors (ApiError instances)
    if (error && typeof error === "object" && "name" in error && "message" in error && error instanceof Error) {
      throw error
    }
    
    // Parse and throw unknown errors
    throw parseApiError(error)
  }
}

/**
 * Gets a user-friendly error message for display
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const apiError = parseApiError(error)
  
  // Provide specific messages for common errors
  if (apiError.name === "BadRequestError") {
    return apiError.message || "Invalid request. Please check your input and try again."
  }
  
  if (apiError.name === "NetworkError") {
    return "Unable to connect to the server. Please check your internet connection and try again."
  }
  
  if (apiError.status === 401) {
    return "Authentication required. Please log in and try again."
  }
  
  if (apiError.status === 403) {
    return "You don't have permission to perform this action."
  }
  
  if (apiError.status === 404) {
    return "The requested resource was not found."
  }
  
  if (apiError.status === 429) {
    return "Too many requests. Please wait a moment and try again."
  }
  
  if (apiError.status && apiError.status >= 500) {
    return "Server error. Please try again later."
  }
  
  return apiError.message || "An unexpected error occurred. Please try again."
}

