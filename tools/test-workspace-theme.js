const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('css/style.css', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

assert.match(css, /--app-canvas:\s*#eef4f8/i, 'workspace canvas should use the cool reference background');
assert.match(css, /--app-blue:\s*#2f9fe5/i, 'workspace should use the reference blue accent');
assert.match(css, /\.app-shell\s*\{[\s\S]*?grid-template-columns:\s*56px 206px/i, 'workspace needs the compact two-level navigation');
assert.match(css, /\.dashboard-grid\s*\{[\s\S]*?254px/i, 'dashboard needs a dedicated activity column');
assert.match(css, /\.search-box\.search-open input/, 'mobile search needs an explicit open state');
assert.match(css, /\[data-theme='dark'\] \.summary-icon/, 'dark theme needs summary icon overrides');
assert.match(css, /\[data-theme='dark'\] \.mobile-tab\.active/, 'dark theme needs mobile navigation overrides');
assert.match(fs.readFileSync('js/app.js', 'utf8'), /searchBox\.classList\.add\('search-open'\)/, 'mobile search must be opened by interaction');
assert.doesNotMatch(css, /#c05621|#f6f2ec|#efe9df|#e5ddd0|#f4a04b|#f2aa5c/i, 'legacy brown and orange palette must be removed');
assert.match(html, /class="dashboard-summary"/, 'dashboard summary must remain available');

console.log('workspace theme verification passed.');
