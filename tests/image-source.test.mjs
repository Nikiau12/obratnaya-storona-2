import assert from 'node:assert/strict';
import test from 'node:test';
import { localImageUrl } from '../lib/security/local-image.ts';

test('image fallback accepts local paths and preserves image query parameters', () => {
  assert.equal(localImageUrl('/books/saturn-autumn.png?v=2', 'https://example.com/_vinext/image').href, 'https://example.com/books/saturn-autumn.png?v=2');
});
test('image fallback rejects cross-origin, protocol-relative and backslash URL tricks', () => {
  for (const value of [null, '', 'https://evil.example/a.png', '//evil.example/a.png', '/\\evil.example/a.png', '/%5cevil.example/a.png', '/\n/evil.example/a.png', 'javascript:alert(1)']) {
    assert.equal(localImageUrl(value, 'https://example.com/_vinext/image'), null, String(value));
  }
});
test('image fallback rejects a self-reference instead of creating a redirect loop', () => {
  assert.equal(localImageUrl('/_vinext/image?url=/books/a.png', 'https://example.com/_vinext/image'), null);
});
