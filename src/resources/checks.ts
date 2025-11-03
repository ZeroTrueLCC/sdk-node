import { HTTPClient } from '../core/http-client';
import {
  CheckCreateParams,
  CheckCreateFromFileParams,
  CheckResponse,
  CheckResult,
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
  async create(params: CheckCreateParams): Promise<CheckResponse> {
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

    return this.httpClient.post<CheckResponse>(endpoint, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
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
  ): Promise<CheckResponse> {
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
  ): Promise<CheckResponse> {
    validateFileExtension(filename);

    const formData = createFormData(buffer, filename, {
      api_key: this.httpClient.getApiKey(),
      is_private_scan: options?.isPrivateScan ?? true,
      is_deep_scan: options?.isDeepScan ?? false,
      idempotency_key: options?.idempotencyKey,
      metadata: options?.metadata ? JSON.stringify(options.metadata) : undefined,
    });

    return this.httpClient.post<CheckResponse>('/api/v1/analyze/file', formData, {
      headers: getHeaders(formData),
    });
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
    return this.httpClient.get<CheckResult>(`/api/v1/result/${checkId}?api_key=${apiKey}`);
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
