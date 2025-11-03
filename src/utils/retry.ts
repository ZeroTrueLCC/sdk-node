import { RateLimitError } from '../errors';

export interface RetryOptions {
  maxRetries: number;
  retryDelay: number;
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Default function to determine if error should be retried
 */
function defaultShouldRetry(error: unknown): boolean {
  // Retry on rate limit errors
  if (error instanceof RateLimitError) {
    return true;
  }

  // Type guard for errors with statusCode
  const hasStatusCode = (err: unknown): err is { statusCode: number } => {
    return typeof err === 'object' && err !== null && 'statusCode' in err;
  };

  // Retry on 5xx server errors
  if (hasStatusCode(error) && error.statusCode >= 500 && error.statusCode < 600) {
    return true;
  }

  // Type guard for network errors
  const hasErrorCode = (err: unknown): err is { code: string } => {
    return typeof err === 'object' && err !== null && 'code' in err;
  };

  // Retry on network errors
  if (hasErrorCode(error) && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT')) {
    return true;
  }

  return false;
}

/**
 * Executes a function with retry logic
 */
export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions): Promise<T> {
  const { maxRetries, retryDelay, shouldRetry = defaultShouldRetry } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      let delay = retryDelay * Math.pow(2, attempt);

      // If rate limit error, respect Retry-After header
      if (error instanceof RateLimitError && error.retryAfter) {
        delay = error.retryAfter * 1000;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
