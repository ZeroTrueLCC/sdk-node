import { describe, it, expect, vi } from 'vitest';
import { pollUntil } from '../../src/utils/polling';

describe('Polling Utility', () => {
  it('should return immediately if condition is met', async () => {
    const fn = vi.fn().mockResolvedValue({ status: 'completed' });
    const condition = (result: any) => result.status === 'completed';

    const result = await pollUntil(fn, condition, {
      pollInterval: 100,
      maxPollTime: 5000,
    });

    expect(result.status).toBe('completed');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should poll until condition is met', async () => {
    let callCount = 0;
    const fn = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({ status: callCount >= 3 ? 'completed' : 'processing' });
    });

    const condition = (result: any) => result.status === 'completed';

    const result = await pollUntil(fn, condition, {
      pollInterval: 50,
      maxPollTime: 5000,
    });

    expect(result.status).toBe('completed');
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should throw timeout error', async () => {
    const fn = vi.fn().mockResolvedValue({ status: 'processing' });
    const condition = (result: any) => result.status === 'completed';

    await expect(
      pollUntil(fn, condition, {
        pollInterval: 50,
        maxPollTime: 200,
      })
    ).rejects.toThrow('Polling timeout exceeded');

    expect(fn).toHaveBeenCalled();
  });

  it('should handle AbortSignal', async () => {
    const fn = vi.fn().mockResolvedValue({ status: 'processing' });
    const condition = (result: any) => result.status === 'completed';
    const controller = new AbortController();

    // Abort after 100ms
    setTimeout(() => controller.abort(), 100);

    await expect(
      pollUntil(fn, condition, {
        pollInterval: 50,
        maxPollTime: 5000,
        signal: controller.signal,
      })
    ).rejects.toThrow('Polling aborted');
  });

  it('should respect poll interval', async () => {
    let callCount = 0;
    const startTime = Date.now();

    const fn = vi.fn().mockImplementation(() => {
      callCount++;
      return Promise.resolve({ status: callCount >= 3 ? 'completed' : 'processing' });
    });

    const condition = (result: any) => result.status === 'completed';

    await pollUntil(fn, condition, {
      pollInterval: 100,
      maxPollTime: 5000,
    });

    const endTime = Date.now();
    const elapsed = endTime - startTime;

    // Should take at least 2 intervals (100ms * 2)
    expect(elapsed).toBeGreaterThanOrEqual(180);
  });

  it('should propagate errors from fn', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('Function error'));
    const condition = (result: any) => result.status === 'completed';

    await expect(
      pollUntil(fn, condition, {
        pollInterval: 50,
        maxPollTime: 5000,
      })
    ).rejects.toThrow('Function error');
  });
});
