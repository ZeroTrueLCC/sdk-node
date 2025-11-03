import { ZeroTrueError } from './base';

/**
 * Error for validation failures (422)
 * @public
 */
export class ValidationError extends ZeroTrueError {
  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, { ...options, statusCode: options?.statusCode ?? 422 });
    this.name = 'ValidationError';
  }
}
