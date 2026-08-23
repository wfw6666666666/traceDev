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
  'activity-panel',
  'btn-primary',
  'resource-row',
  'js/app.js?v=12',
  'js/journal.js?v=16',
  'language-switcher',
  'language-menu',
  'data-i18n',
  'js/i18n.js?v=2'
)

$requiredCss = @(
  '--app-blue:',
  '.app-shell',
  '.tool-rail',
  '.section-sidebar',
  '.workspace-topbar',
  '.quick-access',
  '.activity-panel',
  '@media (max-width: 767px)',
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
} finally {
  Pop-Location
}

Write-Host 'Redesign verification passed.'
