import { HTTPClient } from './core/http-client';
import { DEFAULT_API_BASE_URL } from './constants';
import { Checks } from './resources/checks';
import { ZeroTrueOptions } from './types';
import { validateAPIKey } from './utils/validation';

/**
 * ZeroTrue API Client
 * @public
 *
 * @example
 * ```typescript
 * import ZeroTrue from 'zerotrue';
 *
 * const client = new ZeroTrue({
 *   apiKey: 'zt_your_api_key_here'
 * });
 *
 * const check = await client.checks.create({
 *   input: { type: 'text', value: 'Check this text...' }
 * });
 * ```
 */
export class ZeroTrue {
  /**
   * Checks resource for managing content checks
   */
  public readonly checks: Checks;

  private httpClient: HTTPClient;

  /**
   * Creates a new ZeroTrue client
   *
   * @param options - Client configuration options
   */
  constructor(options: ZeroTrueOptions) {
    const {
      apiKey,
      timeout = 30000,
      maxRetries = 3,
      retryDelay = 1000,
      debug = false,
    } = options;

    // Validate API key
    validateAPIKey(apiKey);

    // Create HTTP client
    this.httpClient = new HTTPClient({
      apiKey,
      baseURL: DEFAULT_API_BASE_URL,
      timeout,
      maxRetries,
      retryDelay,
      debug,
    });

    // Initialize resources
    this.checks = new Checks(this.httpClient);
  }
}
