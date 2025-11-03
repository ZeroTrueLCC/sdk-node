import { describe, it, expect } from 'vitest';
import {
  ZeroTrueError,
  APIError,
  ValidationError,
  AuthenticationError,
  RateLimitError,
} from '../../src/errors';

describe('Error Classes', () => {
  describe('ZeroTrueError', () => {
    it('should create error with message', () => {
      const error = new ZeroTrueError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('ZeroTrueError');
    });

    it('should store error code', () => {
      const error = new ZeroTrueError('Test error', { code: 'TEST_ERROR' });
      expect(error.code).toBe('TEST_ERROR');
    });

    it('should store status code', () => {
      const error = new ZeroTrueError('Test error', { statusCode: 400 });
      expect(error.statusCode).toBe(400);
    });

    it('should store request ID', () => {
      const error = new ZeroTrueError('Test error', { requestId: 'req_123' });
      expect(error.requestId).toBe('req_123');
    });

    it('should format toString correctly', () => {
      const error = new ZeroTrueError('Test error', {
        code: 'TEST_ERROR',
        requestId: 'req_123',
      });
      const str = error.toString();
      expect(str).toContain('ZeroTrueError');
      expect(str).toContain('Test error');
      expect(str).toContain('[TEST_ERROR]');
      expect(str).toContain('(Request ID: req_123)');
    });
  });

  describe('APIError', () => {
    it('should extend ZeroTrueError', () => {
      const error = new APIError('API error');
      expect(error).toBeInstanceOf(ZeroTrueError);
      expect(error).toBeInstanceOf(APIError);
      expect(error.name).toBe('APIError');
    });

    it('should accept all options', () => {
      const error = new APIError('API error', {
        code: 'API_ERROR',
        statusCode: 500,
        requestId: 'req_456',
      });
      expect(error.code).toBe('API_ERROR');
      expect(error.statusCode).toBe(500);
      expect(error.requestId).toBe('req_456');
    });
  });

  describe('ValidationError', () => {
    it('should extend ZeroTrueError', () => {
      const error = new ValidationError('Validation failed');
      expect(error).toBeInstanceOf(ZeroTrueError);
      expect(error.name).toBe('ValidationError');
    });

    it('should default to 422 status code', () => {
      const error = new ValidationError('Validation failed');
      expect(error.statusCode).toBe(422);
    });

    it('should allow custom status code', () => {
      const error = new ValidationError('Validation failed', { statusCode: 400 });
      expect(error.statusCode).toBe(400);
    });
  });

  describe('AuthenticationError', () => {
    it('should extend ZeroTrueError', () => {
      const error = new AuthenticationError('Auth failed');
      expect(error).toBeInstanceOf(ZeroTrueError);
      expect(error.name).toBe('AuthenticationError');
    });

    it('should default to 401 status code', () => {
      const error = new AuthenticationError('Auth failed');
      expect(error.statusCode).toBe(401);
    });

    it('should allow custom status code', () => {
      const error = new AuthenticationError('Auth failed', { statusCode: 403 });
      expect(error.statusCode).toBe(403);
    });
  });

  describe('RateLimitError', () => {
    it('should extend ZeroTrueError', () => {
      const error = new RateLimitError('Rate limit exceeded');
      expect(error).toBeInstanceOf(ZeroTrueError);
      expect(error.name).toBe('RateLimitError');
    });

    it('should default to 429 status code', () => {
      const error = new RateLimitError('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
    });

    it('should store retryAfter', () => {
      const error = new RateLimitError('Rate limit exceeded', { retryAfter: 60 });
      expect(error.retryAfter).toBe(60);
    });

    it('should handle undefined retryAfter', () => {
      const error = new RateLimitError('Rate limit exceeded');
      expect(error.retryAfter).toBeUndefined();
    });
  });
});
