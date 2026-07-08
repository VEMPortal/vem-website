<#
.SYNOPSIS
  Read-only launch-readiness checker for the Vann Equity Management website.

.DESCRIPTION
  Inspects the site files and prints a PASS / WARN / FAIL report for every
  mechanical launch-day check: robots mode, sitemap vs noindex consistency,
  broken internal links, .vercelignore coverage, the contact-form endpoint, and
  analytics presence. It NEVER modifies anything - safe to run as many times as
  you like, before and after the robots swap.

.PARAMETER SitePath
  Path to the site root. Defaults to the known VEM checkout.

.EXAMPLE
  ./verify-launch.ps1 -SitePath "C:\Users\alpha\vem-site-link"
#>
param(
    [string]$SitePath = "C:\Users\alpha\vem-site-link"
)

$ErrorActionPreference = "Stop"
$script:fail = 0
$script:warn = 0

function Line {
    param([string]$status, [string]$label, [string]$detail)
    $color = switch ($status) { "PASS" {"Green"} "WARN" {"Yellow"} "FAIL" {"Red"} default {"Gray"} }
    Write-Host ("[{0}] " -f $status) -ForegroundColor $color -NoNewline
    if ($detail) {
        Write-Host $label -NoNewline
        Write-Host ("  - {0}" -f $detail) -ForegroundColor DarkGray
    } else {
        Write-Host $label
    }
    if ($status -eq "FAIL") { $script:fail++ }
    if ($status -eq "WARN") { $script:warn++ }
}

if (-not (Test-Path $SitePath)) { Write-Host "Site path not found: $SitePath" -ForegroundColor Red; exit 2 }
Write-Host ""
Write-Host "VEM Launch Verification - $SitePath" -ForegroundColor Cyan
Write-Host ("=" * 70)

# ---------------------------------------------------------------------------
# 1. ROBOTS MODE - the single most important check
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-- Crawlability --"
$robotsPath = Join-Path $SitePath "robots.txt"
$prodPath   = Join-Path $SitePath "robots.production.txt"
if (Test-Path $robotsPath) {
    $robots = Get-Content $robotsPath -Raw
    $blocksAll = $robots -match '(?im)^\s*Disallow:\s*/\s*$'
    if ($blocksAll) {
        Write-Host "[ROBOTS MODE: PREVIEW] " -ForegroundColor Yellow -NoNewline
        Write-Host "robots.txt contains 'Disallow: /' - site is BLOCKED from search engines."
        Line "WARN" "robots.txt is in PREVIEW mode" "Expected before launch. Swap to production at go-live (Phase 2)."
    } else {
        Write-Host "[ROBOTS MODE: PRODUCTION] " -ForegroundColor Green -NoNewline
        Write-Host "robots.txt allows crawling."
        Line "PASS" "robots.txt is in PRODUCTION mode" ""
    }
    if ($robots -match '(?i)Sitemap:\s*\S+') { Line "PASS" "robots.txt references a Sitemap" "" }
    else { Line "WARN" "robots.txt has no Sitemap directive" "Add one so crawlers find sitemap.xml." }
} else { Line "FAIL" "robots.txt is missing" "" }

if (Test-Path $prodPath) {
    $prod = Get-Content $prodPath -Raw
    if ($prod -match '(?im)^\s*Allow:\s*/') { Line "PASS" "robots.production.txt present (Allow rules ready)" "" }
    else { Line "WARN" "robots.production.txt present but no 'Allow: /' found" "Confirm it is the production version." }
} else { Line "FAIL" "robots.production.txt is missing" "Needed for the launch swap." }

# ---------------------------------------------------------------------------
# 2. SITEMAP vs NOINDEX consistency
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-- Sitemap and indexability --"
$smPath = Join-Path $SitePath "sitemap.xml"
$sitemapRels = @()
if (Test-Path $smPath) {
    $xml = Get-Content $smPath -Raw
    $sitemapRels = [regex]::Matches($xml, '<loc>\s*([^<]+?)\s*</loc>') | ForEach-Object { ($_.Groups[1].Value.Trim() -replace 'https?://[^/]+/?','/') }
    Line "PASS" ("sitemap.xml present ({0} URLs)" -f $sitemapRels.Count) ""
} else { Line "FAIL" "sitemap.xml is missing" "" }

function In-Sitemap {
    param([string]$rel)
    $r = '/' + ($rel -replace '\\','/')
    $rDir = $r -replace '/index\.html$','/'
    return ($sitemapRels -contains $r) -or ($sitemapRels -contains $rDir)
}

$htmlFiles = Get-ChildItem -Path $SitePath -Recurse -Filter *.html -File |
    Where-Object { $_.FullName -notmatch '\\graphify-out\\' -and $_.Name -ne 'lighthouse-report.report.html' }

$contradictions = @()
$leaks = @()
foreach ($f in $htmlFiles) {
    $rel = $f.FullName.Substring($SitePath.Length+1)
    $c = Get-Content $f.FullName -Raw
    $noindex = $c -match '(?i)<meta[^>]*name=["'']robots["''][^>]*noindex'
    $inSm = In-Sitemap $rel
    if ($noindex -and $inSm) { $contradictions += $rel }
    elseif (-not $noindex -and -not $inSm) { $leaks += $rel }
}
if ($contradictions.Count -eq 0) { Line "PASS" "No noindex page is listed in the sitemap" "" }
else { Line "FAIL" "noindex page(s) found IN sitemap (Google flags this)" ($contradictions -join ', ') }

if ($leaks.Count -eq 0) { Line "PASS" "Every indexable page is in the sitemap" "" }
else { Line "WARN" "Indexable page(s) not in sitemap" (($leaks -join ', ') + "  (OK only if excluded from deploy - see .vercelignore)") }

# ---------------------------------------------------------------------------
# 3. BROKEN INTERNAL LINKS
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-- Internal links --"
$broken = @()
foreach ($f in $htmlFiles) {
    $c = Get-Content $f.FullName -Raw
    $hrefs = [regex]::Matches($c, 'href\s*=\s*["'']([^"''#?]+\.html)[^"'']*["'']') | ForEach-Object { $_.Groups[1].Value }
    foreach ($h in ($hrefs | Sort-Object -Unique)) {
        if ($h -match '^https?:') { continue }
        if ($h.StartsWith('/')) { $target = Join-Path $SitePath $h.TrimStart('/') }
        else { $target = Join-Path $f.DirectoryName $h }
        try { $resolved = [System.IO.Path]::GetFullPath($target) } catch { continue }
        if (-not (Test-Path $resolved)) { $broken += ("{0} -> {1}" -f $f.Name, $h) }
    }
}
if ($broken.Count -eq 0) { Line "PASS" "All internal .html links resolve" "" }
else { Line "FAIL" ("{0} broken internal link(s)" -f $broken.Count) ($broken -join '; ') }

# ---------------------------------------------------------------------------
# 4. .vercelignore coverage (build-only files must not ship)
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-- Deploy hygiene --"
$viPath = Join-Path $SitePath ".vercelignore"
if (Test-Path $viPath) {
    $vi = Get-Content $viPath -Raw
    $mustIgnore = @('templates/','content/','*.md','hero/','build_content.py','robots.production.txt')
    $missing = $mustIgnore | Where-Object { $vi -notmatch [regex]::Escape($_) }
    if ($missing.Count -eq 0) { Line "PASS" ".vercelignore excludes all build-only files" "" }
    else { Line "WARN" ".vercelignore may be missing entries" ($missing -join ', ') }
} else { Line "WARN" ".vercelignore not found" "Build-only files could be served publicly." }

# ---------------------------------------------------------------------------
# 5. CONTACT FORM endpoint
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "-- Conversion path --"
$contactPath = Join-Path $SitePath "contact.html"
if (Test-Path $contactPath) {
    $cc = Get-Content $contactPath -Raw
    $ep = [regex]::Match($cc, 'data-endpoint\s*=\s*["'']([^"'']*)["'']')
    $fb = [regex]::Match($cc, 'data-fallback-email\s*=\s*["'']([^"'']*)["'']')
    if ($ep.Success -and $ep.Groups[1].Value.Trim()) {
        Line "PASS" "Contact form endpoint is configured" $ep.Groups[1].Value
    } elseif ($fb.Success -and $fb.Groups[1].Value.Trim()) {
        Line "WARN" "Contact form endpoint is EMPTY (relying on fallback email)" ("fallback: " + $fb.Groups[1].Value + " - wire a real endpoint or send a live test to confirm delivery.")
    } else {
        Line "FAIL" "Contact form has no endpoint and no fallback email" "Submissions go nowhere."
    }
} else { Line "WARN" "contact.html not found" "" }

# ---------------------------------------------------------------------------
# 6. ANALYTICS
# ---------------------------------------------------------------------------
$idx = Join-Path $SitePath "index.html"
if (Test-Path $idx) {
    $ic = Get-Content $idx -Raw
    $hits = [regex]::Matches($ic, '(?i)(clarity\.ms|gtag|googletagmanager|G-[A-Z0-9]{8,}|plausible|fathom)') | ForEach-Object { $_.Value } | Sort-Object -Unique
    if ($hits) { Line "PASS" "Analytics detected on homepage" ($hits -join ', ') }
    else { Line "WARN" "No analytics detected on homepage" "Confirm tracking is intended before launch." }
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host ("=" * 70)
if ($script:fail -gt 0) {
    Write-Host ("RESULT: NO-GO - {0} FAIL, {1} WARN. Resolve the FAILs before launch." -f $script:fail, $script:warn) -ForegroundColor Red
    exit 1
} elseif ($script:warn -gt 0) {
    Write-Host ("RESULT: REVIEW - 0 FAIL, {0} WARN. Confirm each WARN is intentional (the robots PREVIEW warn is expected pre-launch)." -f $script:warn) -ForegroundColor Yellow
    exit 0
} else {
    Write-Host "RESULT: GO - all mechanical checks pass." -ForegroundColor Green
    exit 0
}
