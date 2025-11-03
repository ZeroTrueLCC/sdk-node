import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../../src/utils/retry';
import { RateLimitError } from '../../src/errors';

describe('Retry Utility', () => {
  it('should succeed on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await withRetry(fn, { maxRetries: 3, retryDelay: 10 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const error1 = new Error('Fail 1');
    (error1 as any).statusCode = 500; // Make it retryable
    const error2 = new Error('Fail 2');
    (error2 as any).statusCode = 500; // Make it retryable

    const fn = vi
      .fn()
      .mockRejectedValueOnce(error1)
      .mockRejectedValueOnce(error2)
      .mockResolvedValue('success');

    const result = await withRetry(fn, { maxRetries: 3, retryDelay: 10 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw error after max retries', async () => {
    const error = new Error('Always fails');
    (error as any).statusCode = 500; // Make it retryable

    const fn = vi.fn().mockRejectedValue(error);

    await expect(withRetry(fn, { maxRetries: 2, retryDelay: 10 })).rejects.toThrow('Always fails');

    expect(fn).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
  });

  it('should not retry on non-retryable errors', async () => {
    const nonRetryableError = new Error('Client error');
    (nonRetryableError as any).statusCode = 400;

    const fn = vi.fn().mockRejectedValue(nonRetryableError);

    await expect(withRetry(fn, { maxRetries: 3, retryDelay: 10 })).rejects.toThrow('Client error');

    expect(fn).toHaveBeenCalledTimes(1); // Should not retry
  });

  it('should retry on RateLimitError', async () => {
    const rateLimitError = new RateLimitError('Too many requests');
    const fn = vi.fn().mockRejectedValueOnce(rateLimitError).mockResolvedValue('success');

    const result = await withRetry(fn, { maxRetries: 3, retryDelay: 10 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should retry on 5xx errors', async () => {
    const serverError = new Error('Server error');
    (serverError as any).statusCode = 500;

    const fn = vi.fn().mockRejectedValueOnce(serverError).mockResolvedValue('success');

    const result = await withRetry(fn, { maxRetries: 3, retryDelay: 10 });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should use custom shouldRetry function', async () => {
    const error = new Error('Custom error');
    const fn = vi.fn().mockRejectedValue(error);

    const shouldRetry = vi.fn().mockReturnValue(false);

    await expect(withRetry(fn, { maxRetries: 3, retryDelay: 10, shouldRetry })).rejects.toThrow(
      'Custom error'
    );

    expect(fn).toHaveBeenCalledTimes(1);
    expect(shouldRetry).toHaveBeenCalledWith(error);
  });

  it('should respect retryAfter from RateLimitError', async () => {
    const rateLimitError = new RateLimitError('Too many requests', { retryAfter: 1 });
    const fn = vi.fn().mockRejectedValueOnce(rateLimitError).mockResolvedValue('success');

    const startTime = Date.now();
    const result = await withRetry(fn, { maxRetries: 3, retryDelay: 10 });
    const endTime = Date.now();

    expect(result).toBe('success');
    expect(endTime - startTime).toBeGreaterThanOrEqual(900); // Should wait ~1 second
  });
});
