import { ZeroTrueError } from './base';

/**
 * Error for rate limit exceeded (429)
 * @public
 */
export class RateLimitError extends ZeroTrueError {
  /**
   * Time to wait before retrying (in seconds)
   */
  public readonly retryAfter?: number;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      cause?: Error;
      retryAfter?: number;
    }
  ) {
    super(message, { ...options, statusCode: options?.statusCode ?? 429 });
    this.name = 'RateLimitError';
    this.retryAfter = options?.retryAfter;
  }
}
