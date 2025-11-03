/**
 * Base error class for all ZeroTrue errors
 * @public
 */
export class ZeroTrueError extends Error {
  /**
   * Error code
   */
  public readonly code?: string;

  /**
   * HTTP status code
   */
  public readonly statusCode?: number;

  /**
   * Request ID for debugging
   */
  public readonly requestId?: string;

  /**
   * Original error that caused this error
   */
  public readonly cause?: Error;

  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'ZeroTrueError';
    this.code = options?.code;
    this.statusCode = options?.statusCode;
    this.requestId = options?.requestId;
    this.cause = options?.cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a string representation of the error
   */
  override toString(): string {
    const parts = [this.name, this.message];

    if (this.code) {
      parts.push(`[${this.code}]`);
    }

    if (this.requestId) {
      parts.push(`(Request ID: ${this.requestId})`);
    }

    return parts.join(': ');
  }
}
