/**
 * Error response from API
 * @public
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
  };
  request_id?: string;
}

/**
 * Error codes returned by the API
 * @public
 */
export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'TIMEOUT'
  | 'INVALID_FILE'
  | 'BAD_GATEWAY'
  | 'INSUFFICIENT_CREDITS'
  | 'INSUFFICIENT_PAID_CREDITS'
  | 'INTERNAL'
  | 'RATE_LIMIT_EXCEEDED';
