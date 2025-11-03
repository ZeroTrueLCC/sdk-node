import { describe, it, expect } from 'vitest';
import { validateAPIKey, validateURL, validateFileExtension } from '../../src/utils/validation';
import { ValidationError } from '../../src/errors';

describe('Validation Utils', () => {
  describe('validateAPIKey', () => {
    it('should accept valid API key', () => {
      expect(() => validateAPIKey('zt_abc123def456')).not.toThrow();
    });

    it('should reject empty key', () => {
      expect(() => validateAPIKey('')).toThrow(ValidationError);
    });

    it('should reject key without zt_ prefix', () => {
      expect(() => validateAPIKey('abc123')).toThrow(ValidationError);
    });

    it('should reject too short key', () => {
      expect(() => validateAPIKey('zt_abc')).toThrow(ValidationError);
    });
  });

  describe('validateURL', () => {
    it('should accept valid HTTPS URL', () => {
      expect(() => validateURL('https://example.com/image.png')).not.toThrow();
    });

    it('should accept valid HTTP URL', () => {
      expect(() => validateURL('http://example.com/image.png')).not.toThrow();
    });

    it('should reject localhost', () => {
      expect(() => validateURL('http://localhost:3000/image.png')).toThrow(ValidationError);
    });

    it('should reject 127.0.0.1', () => {
      expect(() => validateURL('http://127.0.0.1/image.png')).toThrow(ValidationError);
    });

    it('should reject private IP (192.168.x.x)', () => {
      expect(() => validateURL('http://192.168.1.1/image.png')).toThrow(ValidationError);
    });

    it('should reject FTP protocol', () => {
      expect(() => validateURL('ftp://example.com/file')).toThrow(ValidationError);
    });

    it('should reject invalid URL', () => {
      expect(() => validateURL('not-a-url')).toThrow(ValidationError);
    });
  });

  describe('validateFileExtension', () => {
    it('should accept valid image extensions', () => {
      expect(() => validateFileExtension('image.png')).not.toThrow();
      expect(() => validateFileExtension('photo.jpg')).not.toThrow();
      expect(() => validateFileExtension('graphic.webp')).not.toThrow();
    });

    it('should accept valid video extensions', () => {
      expect(() => validateFileExtension('video.mp4')).not.toThrow();
      expect(() => validateFileExtension('movie.mov')).not.toThrow();
    });

    it('should accept valid audio extensions', () => {
      expect(() => validateFileExtension('audio.mp3')).not.toThrow();
      expect(() => validateFileExtension('sound.wav')).not.toThrow();
    });

    it('should accept valid code extensions', () => {
      expect(() => validateFileExtension('script.py')).not.toThrow();
      expect(() => validateFileExtension('code.js')).not.toThrow();
    });

    it('should reject file without extension', () => {
      expect(() => validateFileExtension('file')).toThrow(ValidationError);
    });

    it('should reject unsupported extension', () => {
      expect(() => validateFileExtension('document.pdf')).toThrow(ValidationError);
      expect(() => validateFileExtension('archive.zip')).toThrow(ValidationError);
    });

    it('should be case insensitive', () => {
      expect(() => validateFileExtension('IMAGE.PNG')).not.toThrow();
      expect(() => validateFileExtension('Video.MP4')).not.toThrow();
    });
  });
});
