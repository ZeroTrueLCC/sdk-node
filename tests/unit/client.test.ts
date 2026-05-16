import { describe, it, expect } from 'vitest';
import { ZeroTrue } from '../../src/client';
import { ValidationError } from '../../src/errors';

describe('ZeroTrue Client', () => {
  describe('Constructor', () => {
    it('should create client with valid API key', () => {
      const client = new ZeroTrue({ apiKey: 'zt_test_key_12345' });
      expect(client).toBeInstanceOf(ZeroTrue);
      expect(client.checks).toBeDefined();
    });

    it('should throw ValidationError for invalid API key', () => {
      expect(() => {
        new ZeroTrue({ apiKey: 'invalid_key' });
      }).toThrow(ValidationError);
    });

    it('should throw ValidationError for empty API key', () => {
      expect(() => {
        new ZeroTrue({ apiKey: '' });
      }).toThrow(ValidationError);
    });

    it('should use default options', () => {
      const client = new ZeroTrue({ apiKey: 'zt_test_key_12345' });
      expect(client).toBeInstanceOf(ZeroTrue);
    });

    it('should accept custom options', () => {
      const client = new ZeroTrue({
        apiKey: 'zt_test_key_12345',
        timeout: 60000,
        maxRetries: 5,
        retryDelay: 2000,
        debug: true,
      });
      expect(client).toBeInstanceOf(ZeroTrue);
    });

    it('should initialize checks resource', () => {
      const client = new ZeroTrue({ apiKey: 'zt_test_key_12345' });
      expect(client.checks).toBeDefined();
      expect(typeof client.checks.create).toBe('function');
      expect(typeof client.checks.retrieve).toBe('function');
      expect(typeof client.checks.wait).toBe('function');
      expect(typeof client.checks.createAndWait).toBe('function');
      expect(typeof client.checks.createFromFile).toBe('function');
      expect(typeof client.checks.createFromBuffer).toBe('function');
    });
  });

  describe('Type safety', () => {
    it('should be type-safe with TypeScript', () => {
      const client = new ZeroTrue({ apiKey: 'zt_test_key_12345' });

      // These should compile without errors
      expect(client.checks).toBeDefined();
      expect(typeof client.checks.create).toBe('function');
    });
  });
});
