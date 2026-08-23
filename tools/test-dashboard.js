const assert = require('node:assert/strict');

let dashboard;
try {
  dashboard = require('../js/dashboard.js');
} catch (_error) {
  dashboard = null;
}

assert.ok(dashboard, 'Dashboard count module is missing');

const nodes = new Map([
  ['video-count', { textContent: '' }],
  ['resource-count', { textContent: '' }],
  ['product-count', { textContent: '' }],
  ['metric-video-count', { textContent: '' }],
  ['metric-resource-count', { textContent: '' }],
  ['metric-product-count', { textContent: '' }],
]);

const counts = dashboard.updateContentCounts(
  {
    videos: [{ published: true }, { published: false }, { published: true }],
    resources: [{ published: true }, { published: false }],
    products: [{ published: true }, { published: false }, {}],
  },
  (id) => nodes.get(id)
);

assert.deepEqual(counts, { videos: 2, resources: 1, products: 2 });
assert.equal(nodes.get('video-count').textContent, '02');
assert.equal(nodes.get('resource-count').textContent, '01');
assert.equal(nodes.get('product-count').textContent, '02');
assert.equal(nodes.get('metric-video-count').textContent, '2');
assert.equal(nodes.get('metric-resource-count').textContent, '1');
assert.equal(nodes.get('metric-product-count').textContent, '2');

console.log('dashboard count behavior verification passed.');
