import { ZeroTrueError } from './base';

/**
 * Error for authentication failures (401, 403)
 * @public
 */
export class AuthenticationError extends ZeroTrueError {
  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, { ...options, statusCode: options?.statusCode ?? 401 });
    this.name = 'AuthenticationError';
  }
}
