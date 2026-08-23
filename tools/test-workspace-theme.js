const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('css/style.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

assert.match(css, /--app-canvas:\s*#eef4f8/i, 'workspace canvas should use the cool reference background');
assert.match(css, /--app-blue:\s*#2f9fe5/i, 'workspace should use the reference blue accent');
assert.match(css, /\.app-shell\s*\{[\s\S]*?grid-template-columns:\s*56px 206px/i, 'workspace needs the compact two-level navigation');
assert.match(css, /\.dashboard-grid\s*\{[\s\S]*?254px/i, 'dashboard needs a dedicated activity column');
assert.match(html, /class="dashboard-summary"/, 'dashboard summary must remain available');

console.log('workspace theme verification passed.');
