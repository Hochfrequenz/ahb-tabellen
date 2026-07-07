import { jsonResult, errorResult, toToolResult } from './result';
import { ValidationError, NotFoundError } from '../infrastructure/errors';

describe('mcp/result', () => {
  describe('jsonResult', () => {
    it('wraps data as pretty-printed JSON text content', () => {
      const result = jsonResult({ a: 1 });
      expect(result).toEqual({
        content: [{ type: 'text', text: JSON.stringify({ a: 1 }, null, 2) }],
      });
      expect(result.isError).toBeUndefined();
    });
  });

  describe('errorResult', () => {
    it('marks the result as an error with the message text', () => {
      expect(errorResult('boom')).toEqual({
        content: [{ type: 'text', text: 'boom' }],
        isError: true,
      });
    });
  });

  describe('toToolResult', () => {
    it('returns a JSON result on success', async () => {
      const result = await toToolResult(async () => ['FV2410', 'FV2504']);
      expect(result.isError).toBeUndefined();
      expect(JSON.parse((result.content[0] as { text: string }).text)).toEqual([
        'FV2410',
        'FV2504',
      ]);
    });

    it('maps a ValidationError to a curated isError result', async () => {
      const result = await toToolResult(async () => {
        throw new ValidationError('bad pruefi');
      });
      expect(result.isError).toBe(true);
      expect((result.content[0] as { text: string }).text).toBe('VALIDATION_ERROR: bad pruefi');
    });

    it('maps a NotFoundError to a curated isError result', async () => {
      const result = await toToolResult(async () => {
        throw new NotFoundError('nope');
      });
      expect(result.isError).toBe(true);
      expect((result.content[0] as { text: string }).text).toBe('NOT_FOUND: nope');
    });

    it('maps unexpected errors to a generic isError result without leaking details', async () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const result = await toToolResult(async () => {
        throw new Error('secret internal detail');
      });
      expect(result.isError).toBe(true);
      expect((result.content[0] as { text: string }).text).toBe(
        'INTERNAL_ERROR: An unexpected error occurred'
      );
      expect((result.content[0] as { text: string }).text).not.toContain('secret internal detail');
      spy.mockRestore();
    });
  });
});
