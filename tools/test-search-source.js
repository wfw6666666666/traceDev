const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('js/app.js', 'utf8');

const requiredIndexSources = [
  "typeof VIDEOS !== 'undefined'",
  "typeof RESOURCES !== 'undefined'",
  "typeof PRODUCTS !== 'undefined'",
  "typeof FAQS !== 'undefined'",
  "typeof AUTHOR !== 'undefined'",
  'journalSearchPosts.forEach',
];
requiredIndexSources.forEach((token) => {
  assert.ok(source.includes(token), `Global search index is missing: ${token}`);
});

assert.match(source, /tracedev:journal-loaded[\s\S]*rebuildSearchIndex\(\)/);
assert.match(source, /tracedev:locale-changed[\s\S]*renderAllLocalizedContent/);

const emptyQueryBranch = source.match(
  /if \(!normalizedQuery\) \{([\s\S]*?)\n\s*\}\n\n\s*const matches = getSearchSuggestions/
);
assert.ok(emptyQueryBranch, 'Search empty-query branch was not found');
assert.match(emptyQueryBranch[1], /searchSelectedIndex\s*=\s*-1/);
assert.match(emptyQueryBranch[1], /removeAttribute\(['"]aria-activedescendant['"]\)/);

console.log('search source verification passed.');
