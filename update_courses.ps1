$base = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\course'
$needle = 'import { useState, lazy, Suspense } from ' + [char]34 + 'react' + [char]34 + ';'
$sharedLine = 'import { Stars, FaqItem } from ' + [char]34 + './_shared' + [char]34 + ';'
$replacement = $needle + [char]13 + [char]10 + $sharedLine

$files = Get-ChildItem $base -Filter '*.jsx' | Where-Object { $_.Name -ne '_shared.jsx' -and $_.Name -ne 'CourseMain.jsx' }
$updated = 0
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if (-not $c.Contains('function Stars(')) { continue }
  if ($c.Contains('_shared')) { continue }

  # Add shared import
  $c = $c.Replace($needle, $replacement)

  # Remove Stars function block (greedy match from function to closing brace)
  $starsStart = $c.IndexOf('function Stars({ count = 5 })')
  if ($starsStart -ge 0) {
    $braceDepth = 0
    $inFunc = $false
    $end = $starsStart
    for ($i = $starsStart; $i -lt $c.Length; $i++) {
      if ($c[$i] -eq '{') { $braceDepth++; $inFunc = $true }
      elseif ($c[$i] -eq '}') {
        $braceDepth--
        if ($inFunc -and $braceDepth -eq 0) { $end = $i + 1; break }
      }
    }
    # Skip trailing newlines
    while ($end -lt $c.Length -and ($c[$end] -eq "`r" -or $c[$end] -eq "`n")) { $end++ }
    $c = $c.Substring(0, $starsStart) + $c.Substring($end)
  }

  # Remove FaqItem function block
  $faqStart = $c.IndexOf('function FaqItem({ item })')
  if ($faqStart -ge 0) {
    $braceDepth = 0
    $inFunc = $false
    $end = $faqStart
    for ($i = $faqStart; $i -lt $c.Length; $i++) {
      if ($c[$i] -eq '{') { $braceDepth++; $inFunc = $true }
      elseif ($c[$i] -eq '}') {
        $braceDepth--
        if ($inFunc -and $braceDepth -eq 0) { $end = $i + 1; break }
      }
    }
    while ($end -lt $c.Length -and ($c[$end] -eq "`r" -or $c[$end] -eq "`n")) { $end++ }
    $c = $c.Substring(0, $faqStart) + $c.Substring($end)
  }

  [System.IO.File]::WriteAllText($f.FullName, $c)
  $updated++
  Write-Host ('Done: ' + $f.Name)
}
Write-Host ('Total: ' + $updated)
