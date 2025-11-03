export interface PollOptions {
  pollInterval: number;
  maxPollTime: number;
  signal?: AbortSignal;
}

/**
 * Polls a function until condition is met or timeout
 */
export async function pollUntil<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  options: PollOptions
): Promise<T> {
  const { pollInterval, maxPollTime, signal } = options;
  const startTime = Date.now();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Check if aborted
    if (signal?.aborted) {
      throw new Error('Polling aborted');
    }

    // Check if timeout exceeded
    if (Date.now() - startTime > maxPollTime) {
      throw new Error(`Polling timeout exceeded (${maxPollTime}ms)`);
    }

    // Execute function
    const result = await fn();

    // Check condition
    if (condition(result)) {
      return result;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }
}
