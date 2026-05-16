/**
 * Configuration options for ZeroTrue client
 * @public
 */
export interface ZeroTrueOptions {
  /**
   * Your ZeroTrue API key (format: zt_xxxxxxxxxxxxx)
   * Get your API key from https://app.zerotrue.app
   */
  apiKey: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Maximum number of retry attempts for failed requests
   * @default 3
   */
  maxRetries?: number;

  /**
   * Delay between retry attempts in milliseconds
   * @default 1000
   */
  retryDelay?: number;

  /**
   * Enable debug mode (logs all requests)
   * @default false
   */
  debug?: boolean;
}
