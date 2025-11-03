import * as fs from 'fs';
import FormData from 'form-data';

/**
 * Reads file to Buffer
 */
export async function readFileToBuffer(filePath: string): Promise<Buffer> {
  return fs.promises.readFile(filePath);
}

/**
 * Creates FormData for file upload
 */
export function createFormData(
  file: Buffer,
  filename: string,
  additionalParams?: Record<string, unknown>
): FormData {
  const formData = new FormData();

  formData.append('file', file, filename);

  if (additionalParams) {
    for (const [key, value] of Object.entries(additionalParams)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
  }

  return formData;
}

/**
 * Get headers for FormData
 */
export function getHeaders(formData: FormData): Record<string, string> {
  return formData.getHeaders();
}

/**
 * Gets MIME type from filename
 */
export function getFileMimeType(filename: string): string {
  // Get file extension (works in both browser and Node.js)
  const lastDot = filename.lastIndexOf('.');
  const ext = lastDot >= 0 ? filename.substring(lastDot).toLowerCase() : '';
  const mimeTypes: Record<string, string> = {
    // Images
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
    // Videos
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.webm': 'video/webm',
    // Audio
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    // Code
    '.py': 'text/x-python',
    '.js': 'text/javascript',
    '.ts': 'text/typescript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.json': 'application/json',
    '.txt': 'text/plain',
  };

  return mimeTypes[ext] || 'application/octet-stream';
}
