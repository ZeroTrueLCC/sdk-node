import { ZeroTrueError } from './base';

/**
 * Error returned from the API
 * @public
 */
export class APIError extends ZeroTrueError {
  constructor(
    message: string,
    options?: {
      code?: string;
      statusCode?: number;
      requestId?: string;
      cause?: Error;
    }
  ) {
    super(message, options);
    this.name = 'APIError';
  }
}
