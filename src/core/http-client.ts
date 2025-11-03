import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {
  APIError,
  AuthenticationError,
  RateLimitError,
  ValidationError,
  ZeroTrueError,
} from '../errors';
import { ErrorResponse } from '../types';
import { withRetry } from '../utils/retry';

export interface HTTPClientOptions {
  apiKey: string;
  baseURL: string;
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  debug: boolean;
}

/**
 * HTTP client for ZeroTrue API
 */
export class HTTPClient {
  private client: AxiosInstance;
  private options: HTTPClientOptions;

  constructor(options: HTTPClientOptions) {
    this.options = options;

    this.client = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout,
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'User-Agent': 'zerotrue-node-sdk/1.0.0',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Get API key
   */
  getApiKey(): string {
    return this.options.apiKey;
  }

  /**
   * Makes a GET request
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  /**
   * Makes a POST request
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  /**
   * Makes a request with retry logic
   */
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    if (this.options.debug) {
      console.log('[ZeroTrue] Request:', config.method, config.url);
    }

    const makeRequest = async (): Promise<T> => {
      const response: AxiosResponse<T> = await this.client.request(config);
      return response.data;
    };

    return withRetry(makeRequest, {
      maxRetries: this.options.maxRetries,
      retryDelay: this.options.retryDelay,
    });
  }

  /**
   * Handles errors from API
   */
  private handleError(error: unknown): never {
    // Type guard for axios errors
    const isAxiosError = (
      err: unknown
    ): err is {
      response?: { status: number; data?: ErrorResponse; headers: Record<string, string> };
      message?: string;
    } => {
      return typeof err === 'object' && err !== null && ('response' in err || 'message' in err);
    };

    if (!isAxiosError(error)) {
      throw new APIError('Unknown error');
    }

    if (this.options.debug) {
      console.error('[ZeroTrue] Error:', error.message || 'Unknown error');
    }

    // Network errors
    if (!error.response) {
      throw new APIError(error.message || 'Network error');
    }

    const status = error.response.status;
    const data: ErrorResponse | undefined = error.response.data;

    const errorCode = data?.error?.code;
    const errorMessage = data?.error?.message || error.message || 'Unknown error';
    const requestId = data?.request_id;

    // Authentication errors (401, 403)
    if (status === 401 || status === 403) {
      throw new AuthenticationError(errorMessage, {
        code: errorCode,
        statusCode: status,
        requestId,
      });
    }

    // Validation errors (422)
    if (status === 422) {
      throw new ValidationError(errorMessage, {
        code: errorCode,
        statusCode: status,
        requestId,
      });
    }

    // Rate limit errors (429)
    if (status === 429) {
      const retryAfter = error.response.headers['retry-after']
        ? parseInt(error.response.headers['retry-after'])
        : undefined;

      throw new RateLimitError(errorMessage || 'Rate limit exceeded', {
        code: errorCode || 'RATE_LIMIT_EXCEEDED',
        statusCode: status,
        requestId,
        retryAfter,
      });
    }

    // Client errors (4xx)
    if (status >= 400 && status < 500) {
      throw new APIError(errorMessage, {
        code: errorCode,
        statusCode: status,
        requestId,
      });
    }

    // Server errors (5xx)
    if (status >= 500) {
      throw new APIError(errorMessage || 'Internal server error', {
        code: errorCode || 'INTERNAL',
        statusCode: status,
        requestId,
      });
    }

    // Unknown errors
    throw new ZeroTrueError(errorMessage || 'Unknown error', {
      code: errorCode,
      statusCode: status,
      requestId,
    });
  }
}
