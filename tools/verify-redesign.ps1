$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw (Join-Path $root 'index.html')
$css = Get-Content -Raw (Join-Path $root 'css\style.css')
$i18nPath = Join-Path $root 'js\i18n.js'
$bundledNode = 'C:\Users\wfw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$node = if (Get-Command node -ErrorAction SilentlyContinue) { 'node' } elseif (Test-Path $bundledNode) { $bundledNode } else { throw 'Node.js runtime not found' }

$requiredHtml = @(
  'app-shell',
  'tool-rail',
  'section-sidebar',
  'workspace-topbar',
  'site-search',
  'quick-access',
  'dashboard-summary',
  'css/style.css?v=15',
  'data-i18n-aria-label="dashboard.overview"',
  'metric-video-count',
  'activity-panel',
  'btn-primary',
  'resource-row',
  'js/dashboard.js?v=1',
  'js/app.js?v=14',
  'js/journal.js?v=17',
  'language-switcher',
  'language-menu',
  'data-i18n',
  'js/i18n.js?v=4'
)

$requiredCss = @(
  '--app-blue:',
  '.app-shell',
  '.tool-rail',
  '.section-sidebar',
  '.workspace-topbar',
  '.quick-access',
  '.dashboard-summary',
  '.summary-card:focus-visible',
  '.activity-panel',
  "[data-theme='dark'] .section-sidebar",
  "[data-theme='dark'] .activity-panel",
  'color-scheme: dark',
  '@media (max-width: 980px)',
  '.language-switcher',
  '.language-menu'
)

$requiredJs = @(
  'site-search',
  'syncActiveTabs',
  'updateDashboardCounts',
  'searchIndex',
  'applyPanelSearch',
  'renderSearchResults',
  'data-search-tab',
  'getSearchSuggestions',
  'highlightSearchTerm',
  'searchSelectedIndex',
  'addSearchIndexEntry',
  'rebuildSearchSuggestions',
  'tracedev:journal-loaded',
  'AUTHOR.name'
)

$requiredSearchHtml = @(
  'search-results'
)

foreach ($token in $requiredHtml) {
  if ($html -notmatch [regex]::Escape($token)) {
    throw "Missing HTML redesign token: $token"
  }
}

foreach ($token in $requiredCss) {
  if ($css -notmatch [regex]::Escape($token)) {
    throw "Missing CSS redesign token: $token"
  }
}

if ($css -notmatch '@media \(max-width: 980px\)\s*\{\s*body \{ padding: 0; \}') {
  throw 'Tablet breakpoint must collapse the workspace navigation at 980px.'
}

$appJs = Get-Content -Raw (Join-Path $root 'js\app.js')
foreach ($token in $requiredJs) {
  if ($appJs -notmatch [regex]::Escape($token)) {
    throw "Missing JS redesign token: $token"
  }
}

$journalJs = Get-Content -Raw (Join-Path $root 'js\journal.js')
if ($journalJs -notmatch [regex]::Escape('tracedev:journal-loaded')) {
  throw 'Missing journal search integration event.'
}

if (-not (Test-Path $i18nPath)) {
  throw 'Missing js/i18n.js.'
}

$i18nJs = Get-Content -Raw $i18nPath
foreach ($token in @('zh-CN', 'zh-TW', 'en:', 'ja:', 'ko:', 'traceDevLocale', 'translate', 'getLocalizedContent', 'tracedev:locale-changed')) {
  if ($i18nJs -notmatch [regex]::Escape($token)) {
    throw "Missing i18n token: $token"
  }
}

foreach ($token in @('getLocalizedContent', 'tracedev:locale-changed', 'renderAllLocalizedContent')) {
  if ($appJs -notmatch [regex]::Escape($token)) {
    throw "Missing localized app integration: $token"
  }
}

if ($journalJs -notmatch [regex]::Escape('getLocalizedContent')) {
  throw 'Missing localized journal integration.'
}

foreach ($token in $requiredSearchHtml) {
  if ($html -notmatch [regex]::Escape($token)) {
    throw "Missing search HTML token: $token"
  }
}

$djangoTemplate = Get-Content -Raw (Join-Path $root 'templates\site_index.html')
if ($html -ne $djangoTemplate) {
  throw 'index.html and templates/site_index.html are not synchronized.'
}

Push-Location $root
try {
  & $node --check js\app.js
  if ($LASTEXITCODE -ne 0) { throw 'app.js syntax verification failed.' }
  & $node --check js\dashboard.js
  if ($LASTEXITCODE -ne 0) { throw 'dashboard.js syntax verification failed.' }
  & $node --check js\i18n.js
  if ($LASTEXITCODE -ne 0) { throw 'i18n.js syntax verification failed.' }
  & $node --check js\journal.js
  if ($LASTEXITCODE -ne 0) { throw 'journal.js syntax verification failed.' }
  & $node --check js\data.js
  if ($LASTEXITCODE -ne 0) { throw 'data.js syntax verification failed.' }
  & $node tools\test-i18n.js
  if ($LASTEXITCODE -ne 0) { throw 'i18n behavior verification failed.' }
  & $node tools\test-search-source.js
  if ($LASTEXITCODE -ne 0) { throw 'search behavior verification failed.' }
  & $node tools\test-dashboard.js
  if ($LASTEXITCODE -ne 0) { throw 'dashboard count behavior verification failed.' }
  & $node tools\test-workspace-theme.js
  if ($LASTEXITCODE -ne 0) { throw 'workspace theme verification failed.' }
} finally {
  Pop-Location
}

Write-Host 'Redesign verification passed.'
