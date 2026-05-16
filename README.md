# ZeroTrue Node.js SDK

Official Node.js SDK for [ZeroTrue AI Detection API](https://app.zerotrue.app) - Detect AI-generated content in text, images, videos, and audio.

[![npm version](https://badge.fury.io/js/%40zerotrue%2Fsdk-node.svg)](https://www.npmjs.com/package/@zerotrue/sdk-node)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Full TypeScript support** with comprehensive type definitions
- **JavaScript support** with JSDoc for IntelliSense
- **Promise-based API** for modern async/await syntax
- **Automatic retry** on failures with exponential backoff
- **Rate limit handling** with smart backoff
- **Idempotency** support for safe retries
- **File upload** support (Buffer, file path)
- **Auto-polling** for check results
- **CommonJS & ESM** support
- **Minimal dependencies** (only axios and form-data)

## Installation

```bash
npm install @zerotrue/sdk-node
```

```bash
yarn add @zerotrue/sdk-node
```

```bash
pnpm add @zerotrue/sdk-node
```

## Quick Start

### TypeScript

```typescript
import ZeroTrue from '@zerotrue/sdk-node';

const client = new ZeroTrue({
  apiKey: 'zt_your_api_key_here',
});

// Check text for AI generation
const result = await client.checks.createAndWait({
  input: { type: 'text', value: 'Check this text...' },
});

console.log('AI Probability:', result.ai_probability + '%');
console.log('Result:', result.result_type);
```

### JavaScript (CommonJS)

```javascript
// Default import
const ZeroTrue = require('@zerotrue/sdk-node').default;

// Or destructured
const { ZeroTrue } = require('@zerotrue/sdk-node');

const client = new ZeroTrue({
  apiKey: 'zt_your_api_key_here',
});

// Check text for AI generation
const result = await client.checks.createAndWait({
  input: { type: 'text', value: 'Check this text...' },
});

console.log('AI Probability:', result.ai_probability + '%');
```

## Usage

### Initialize Client

```typescript
const client = new ZeroTrue({
  apiKey: 'zt_your_api_key_here',
  timeout: 30000, // 30 seconds (optional)
  maxRetries: 3, // retry failed requests (optional)
  retryDelay: 1000, // 1 second between retries (optional)
  debug: false, // enable debug logging (optional)
});
```

### Check Text

```typescript
const check = await client.checks.create({
  input: {
    type: 'text',
    value: 'Your text to analyze...',
  },
  isPrivateScan: true, // default
  isDeepScan: false, // default
});

// Get result
const result = await client.checks.retrieve(check.id);

// Or wait for completion
const result = await client.checks.wait(check.id);
```

### Check URL

```typescript
const check = await client.checks.create({
  input: {
    type: 'url',
    value: 'https://example.com/image.png',
  },
});
```

### Check File

#### From file path

```typescript
const check = await client.checks.createFromFile('./image.png', {
  isPrivateScan: true,
  isDeepScan: false,
});
```

#### From Buffer

```typescript
import * as fs from 'fs';

const buffer = fs.readFileSync('./image.png');
const check = await client.checks.createFromBuffer(buffer, 'image.png');
```

### Wait for Result

```typescript
// Simple wait
const result = await client.checks.wait(checkId);

// With custom options
const result = await client.checks.wait(checkId, {
  pollInterval: 2000, // 2 seconds (default)
  maxPollTime: 300000, // 5 minutes (default)
  signal: abortController.signal, // for cancellation
});
```

### Create and Wait (One-liner)

```typescript
const result = await client.checks.createAndWait({
  input: { type: 'text', value: 'Check this...' },
});

console.log('AI Probability:', result.ai_probability);
```

### Idempotency

```typescript
const check = await client.checks.create({
  input: { type: 'text', value: 'Test' },
  idempotencyKey: 'unique-request-id-123', // Reusing same key returns cached response
});
```

## Error Handling

```typescript
import {
  ValidationError,
  AuthenticationError,
  RateLimitError,
  APIError,
} from '@zerotrue/sdk-node';

try {
  const check = await client.checks.create({
    input: { type: 'text', value: 'Test' },
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failed:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid API key:', error.message);
  } else if (error instanceof RateLimitError) {
    console.error('Rate limit exceeded. Retry after:', error.retryAfter, 'seconds');
  } else if (error instanceof APIError) {
    console.error('API error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## API Reference

### Client Methods

#### `new ZeroTrue(options)`

Creates a new ZeroTrue client.

**Options:**

- `apiKey` (string, required) - Your ZeroTrue API key
- `timeout` (number, optional) - Request timeout in ms (default: `30000`)
- `maxRetries` (number, optional) - Max retry attempts (default: `3`)
- `retryDelay` (number, optional) - Delay between retries in ms (default: `1000`)
- `debug` (boolean, optional) - Enable debug logging (default: `false`)

### Checks Resource

#### `client.checks.create(params)`

Creates a new check.

**Parameters:**

- `input` (object, required) - Input to check:
  - `type` (string) - `'text'` or `'url'`
  - `value` (string) - Text content or URL
- `isPrivateScan` (boolean, optional) - Private scan (default: `true`)
- `isDeepScan` (boolean, optional) - Deep scan (default: `false`)
- `idempotencyKey` (string, optional) - Idempotency key
- `metadata` (object, optional) - Additional metadata

**Returns:** `Promise<CheckResponse>`

#### `client.checks.createFromFile(filePath, options?)`

Creates a check from a file path.

**Returns:** `Promise<CheckResponse>`

#### `client.checks.createFromBuffer(buffer, filename, options?)`

Creates a check from a Buffer.

**Returns:** `Promise<CheckResponse>`

#### `client.checks.retrieve(checkId)`

Retrieves a check by ID.

**Returns:** `Promise<CheckResult>`

#### `client.checks.wait(checkId, options?)`

Waits for a check to complete.

**Options:**

- `pollInterval` (number) - Polling interval in ms (default: `2000`)
- `maxPollTime` (number) - Max wait time in ms (default: `300000`)
- `signal` (AbortSignal) - For cancellation

**Returns:** `Promise<CheckResult>`

#### `client.checks.createAndWait(params, options?)`

Creates a check and waits for completion.

**Returns:** `Promise<CheckResult>`

## Types

### CheckResponse

```typescript
{
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'canceled' | 'expired';
  created_at: string;
}
```

### CheckResult

Extends `CheckResponse` with additional fields:

```typescript
{
  // ... CheckResponse fields
  ai_probability?: number;
  human_probability?: number;
  combined_probability?: number;
  result_type?: string;
  ml_model?: string;
  ml_model_version?: string;
  file_url?: string;
  original_filename?: string;
  size_bytes?: number;
  size_mb?: number;
  resolution?: string;
  length?: number;
  suspected_models?: Array<{
    model_name: string;
    confidence_pct: number;
  }>;
  segments?: Array<{
    label: string;
    confidence_pct: number;
    start_char?: number;
    end_char?: number;
    start_s?: number;
    end_s?: number;
  }>;
  // ... and more
}
```

## Rate Limits

- **60 requests per minute**
- **10,000 requests per day**

The SDK automatically handles rate limits with retry logic.

## Supported File Formats

- **Images:** jpg, jpeg, png, gif, bmp, tiff, webp
- **Videos:** mp4, mov, avi, mkv, webm
- **Audio:** mp3, wav, ogg, flac
- **Code:** py, js, ts, html, css, java, cpp, go, json, txt

## Examples

See the [examples/](./examples/) directory for more examples:

- [basic.ts](./examples/basic.ts) - Basic usage
- [basic.js](./examples/basic.js) - JavaScript version
- [file-check.ts](./examples/file-check.ts) - File upload examples
- [error-handling.ts](./examples/error-handling.ts) - Error handling

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Lint
npm run lint

# Format
npm run format
```

## License

MIT

## Support

- Documentation: [https://app.zerotrue.app/docs](https://app.zerotrue.app/docs)
- Issues: [GitHub Issues](https://github.com/zerotrue/zerotrue-node/issues)
- Email: support@zerotrue.ai

