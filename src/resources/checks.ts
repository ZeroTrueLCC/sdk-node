import { HTTPClient } from '../core/http-client';
import {
  CheckCreateParams,
  CheckCreateFromFileParams,
  CheckResult,
  CheckStatus,
  WaitOptions,
} from '../types';
import { validateURL, validateFileExtension } from '../utils/validation';
import { readFileToBuffer, createFormData, getHeaders } from '../utils/file';
import { pollUntil } from '../utils/polling';

/**
 * Checks resource for managing content checks
 * @public
 */
export class Checks {
  private httpClient: HTTPClient;

  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  /**
   * Creates a new check for text or URL
   *
   * @param params - Check parameters
   * @returns Check response with ID and status
   *
   * @example
   * ```typescript
   * const check = await client.checks.create({
   *   input: { type: 'text', value: 'Check this text...' }
   * });
   * console.log(check.id); // Check ID
   * ```
   */
  async create(params: CheckCreateParams): Promise<CheckResult> {
    const { input, isPrivateScan = true, isDeepScan = false, idempotencyKey, metadata } = params;

    // Validate URL input
    if (input.type === 'url') {
      validateURL(input.value);
    }

    // Prepare request body based on input type
    const body: Record<string, unknown> = {
      [input.type]: input.value, // 'text' or 'url' as key
      api_key: this.httpClient.getApiKey(),
      is_private_scan: isPrivateScan,
      is_deep_scan: isDeepScan,
    };

    if (idempotencyKey) {
      body.idempotency_key = idempotencyKey;
    }

    if (metadata) {
      body.metadata = metadata;
    }

    // Use different endpoints based on input type
    const endpoint = input.type === 'text' ? '/api/v1/analyze/text' : '/api/v1/analyze/url';

    // API expects form-urlencoded, not JSON
    const formData = new URLSearchParams();
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    const raw = await this.httpClient.post<{
      id: string;
      status: string;
      error: null;
      result?: Record<string, unknown>;
    }>(endpoint, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return { id: raw.id, status: raw.status as CheckStatus, ...raw.result } as CheckResult;
  }

  /**
   * Creates a check from a file path
   *
   * @param filePath - Path to file
   * @param options - Additional options
   * @returns Check response
   *
   * @example
   * ```typescript
   * const check = await client.checks.createFromFile('./image.png');
   * ```
   */
  async createFromFile(
    filePath: string,
    options?: CheckCreateFromFileParams
  ): Promise<CheckResult> {
    const filename = filePath.split('/').pop() || 'file';
    validateFileExtension(filename);
    const buffer = await readFileToBuffer(filePath);
    return this.createFromBuffer(buffer, filename, options);
  }

  /**
   * Creates a check from a Buffer
   *
   * @param buffer - File buffer
   * @param filename - Filename with extension
   * @param options - Additional options
   * @returns Check response
   *
   * @example
   * ```typescript
   * const buffer = fs.readFileSync('./image.png');
   * const check = await client.checks.createFromBuffer(buffer, 'image.png');
   * ```
   */
  async createFromBuffer(
    buffer: Buffer,
    filename: string,
    options?: CheckCreateFromFileParams
  ): Promise<CheckResult> {
    validateFileExtension(filename);

    const formData = createFormData(buffer, filename, {
      api_key: this.httpClient.getApiKey(),
      is_private_scan: options?.isPrivateScan ?? true,
      is_deep_scan: options?.isDeepScan ?? false,
      idempotency_key: options?.idempotencyKey,
      metadata: options?.metadata ? JSON.stringify(options.metadata) : undefined,
    });

    const raw = await this.httpClient.post<{
      id: string;
      status: string;
      error: null;
      result?: Record<string, unknown>;
    }>('/api/v1/analyze/file', formData, {
      headers: getHeaders(formData),
    });
    return { id: raw.id, status: raw.status as CheckStatus, ...raw.result } as CheckResult;
  }

  /**
   * Retrieves a check by ID
   *
   * @param checkId - Check ID
   * @returns Check result
   *
   * @example
   * ```typescript
   * const result = await client.checks.retrieve('check-id');
   * console.log(result.status); // 'completed'
   * console.log(result.ai_probability); // 85.5
   * ```
   */
  async retrieve(checkId: string): Promise<CheckResult> {
    const apiKey = this.httpClient.getApiKey();
    const raw = await this.httpClient.get<{
      id: string;
      status: string;
      error: null;
      result?: Record<string, unknown>;
    }>(`/api/v1/result/${checkId}?api_key=${apiKey}`);
    return { id: raw.id, status: raw.status as CheckStatus, ...raw.result } as CheckResult;
  }

  /**
   * Waits for a check to complete by polling
   *
   * @param checkId - Check ID
   * @param options - Polling options
   * @returns Completed check result
   *
   * @example
   * ```typescript
   * const result = await client.checks.wait('check-id', {
   *   pollInterval: 2000,  // 2 seconds
   *   maxPollTime: 300000  // 5 minutes
   * });
   * ```
   */
  async wait(checkId: string, options?: Partial<WaitOptions>): Promise<CheckResult> {
    const pollOptions: Required<Pick<WaitOptions, 'pollInterval' | 'maxPollTime'>> &
      Pick<WaitOptions, 'signal'> = {
      pollInterval: options?.pollInterval ?? 2000,
      maxPollTime: options?.maxPollTime ?? 300000,
      signal: options?.signal,
    };

    return pollUntil(
      () => this.retrieve(checkId),
      (result) => {
        const status = result.status;
        // Stop polling on terminal statuses
        return (
          status === 'completed' ||
          status === 'completed_with_fallback' ||
          status === 'failed' ||
          status === 'canceled'
        );
      },
      pollOptions
    );
  }

  /**
   * Creates a check and waits for completion
   *
   * @param params - Check parameters
   * @param options - Polling options
   * @returns Completed check result
   *
   * @example
   * ```typescript
   * const result = await client.checks.createAndWait({
   *   input: { type: 'text', value: 'Check this...' }
   * });
   * console.log(result.ai_probability);
   * ```
   */
  async createAndWait(
    params: CheckCreateParams,
    options?: Partial<WaitOptions>
  ): Promise<CheckResult> {
    const check = await this.create(params);
    return this.wait(check.id, options);
  }
}
