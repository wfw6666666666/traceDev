$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$html = Get-Content -Raw (Join-Path $root 'index.html')
$css = Get-Content -Raw (Join-Path $root 'css\style.css')
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
  'resource-row'
)

$requiredCss = @(
  '--app-blue:',
  '.app-shell',
  '.tool-rail',
  '.section-sidebar',
  '.workspace-topbar',
  '.quick-access',
  '.activity-panel',
  '@media (max-width: 767px)'
)

$requiredJs = @(
  'site-search',
  'syncActiveTabs',
  'updateDashboardCounts',
  'searchIndex',
  'applyPanelSearch',
  'renderSearchResults',
  'data-search-tab'
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

foreach ($token in $requiredSearchHtml) {
  if ($html -notmatch [regex]::Escape($token)) {
    throw "Missing search HTML token: $token"
  }
}

Push-Location $root
try {
  & $node --check js\app.js
  & $node --check js\journal.js
  & $node --check js\data.js
} finally {
  Pop-Location
}

Write-Host 'Redesign verification passed.'
