import { ValidationError } from '../errors';

/**
 * Validates API key format (must start with 'zt_')
 */
export function validateAPIKey(apiKey: string): void {
  if (!apiKey) {
    throw new ValidationError('API key is required');
  }

  if (!apiKey.startsWith('zt_')) {
    throw new ValidationError('Invalid API key format. API key must start with "zt_"');
  }

  if (apiKey.length < 10) {
    throw new ValidationError('Invalid API key format. API key is too short');
  }
}

/**
 * Validates URL format and blocks localhost
 */
export function validateURL(url: string): void {
  if (!url) {
    throw new ValidationError('URL is required');
  }

  // Check if it's a valid URL
  try {
    const parsedURL = new URL(url);

    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
      throw new ValidationError('Only HTTP and HTTPS URLs are allowed');
    }

    // Block localhost and private IPs
    const hostname = parsedURL.hostname.toLowerCase();
    const blockedPatterns = [
      /^localhost$/i,
      /^127\./,
      /^0\.0\.0\.0$/,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2\d|3[01])\./,
    ];

    for (const pattern of blockedPatterns) {
      if (pattern.test(hostname)) {
        throw new ValidationError('Local and private IP addresses are not allowed');
      }
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError(`Invalid URL format: ${(error as Error).message}`);
  }
}

/**
 * Validates file extension
 */
export function validateFileExtension(filename: string): void {
  const supportedExtensions = [
    // Images
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'webp',
    // Videos
    'mp4',
    'mov',
    'avi',
    'mkv',
    'webm',
    // Audio
    'mp3',
    'wav',
    'ogg',
    'flac',
    // Code
    'py',
    'js',
    'ts',
    'html',
    'css',
    'java',
    'cpp',
    'go',
    'json',
    'txt',
  ];

  const extension = filename.split('.').pop()?.toLowerCase();

  if (!extension) {
    throw new ValidationError('File must have an extension');
  }

  if (!supportedExtensions.includes(extension)) {
    throw new ValidationError(
      `Unsupported file format: .${extension}. Supported formats: ${supportedExtensions.join(', ')}`
    );
  }
}
