import ZeroTrue, { ValidationError, AuthenticationError, RateLimitError, APIError } from '../src';

async function main() {
  const client = new ZeroTrue({
    apiKey: process.env.ZEROTRUE_API_KEY!,
  });

  // Example 1: Validation Error
  try {
    console.log('Example 1: Testing validation error...');
    await client.checks.create({
      input: {
        type: 'url',
        value: 'http://localhost:3000/image.png', // Local URLs are forbidden
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log('✓ Validation Error caught');
      console.log('  Message:', error.message);
      console.log('  Code:', error.code);
    }
  }

  // Example 2: Authentication Error
  try {
    console.log('\nExample 2: Testing authentication error...');
    const badClient = new ZeroTrue({
      apiKey: 'zt_invalid_key_12345',
    });
    await badClient.checks.create({
      input: { type: 'text', value: 'Test' },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      console.log('✓ Authentication Error caught');
      console.log('  Message:', error.message);
      console.log('  Status:', error.statusCode);
    }
  }

  // Example 3: Rate Limit Error
  try {
    console.log('\nExample 3: Making many requests (may hit rate limit)...');
    const promises = Array(70)
      .fill(null)
      .map(() =>
        client.checks.create({
          input: { type: 'text', value: 'Test' + Math.random() },
        })
      );
    await Promise.all(promises);
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log('✓ Rate Limit Error caught');
      console.log('  Message:', error.message);
      console.log('  Retry after:', error.retryAfter, 'seconds');
    }
  }

  // Example 4: General Error Handling
  try {
    console.log('\nExample 4: General error handling...');
    await client.checks.create({
      input: {
        type: 'text',
        value: 'Some text',
      },
    });
    console.log('✓ Request successful');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.error('Validation failed:', error.message);
    } else if (error instanceof AuthenticationError) {
      console.error('Authentication failed:', error.message);
    } else if (error instanceof RateLimitError) {
      console.error('Rate limit exceeded. Retry after:', error.retryAfter);
    } else if (error instanceof APIError) {
      console.error('API error:', error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
}

main();
