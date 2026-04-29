$base = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\course'
$files = Get-ChildItem $base -Filter '*.jsx' | Where-Object { $_.Name -ne '_shared.jsx' -and $_.Name -ne 'CourseMain.jsx' }
$updated = 0

foreach ($f in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $c = [System.Text.Encoding]::UTF8.GetString($bytes)

  if (-not $c.Contains('_shared')) { continue }
  if (-not $c.Contains('function Stars(')) { continue }

  $changed = $false

  # Remove Stars function: from 'function Stars(' to next top-level function
  $i1 = $c.IndexOf('function Stars({ count = 5 }) {')
  $i2 = $c.IndexOf('function AccordionItem')
  if ($i1 -ge 0 -and $i2 -gt $i1) {
    $c = $c.Substring(0, $i1) + $c.Substring($i2)
    $changed = $true
  }

  # Remove FaqItem function: from 'function FaqItem(' to next function
  # Try multiple possible next functions
  $i3 = $c.IndexOf('function FaqItem({ item }) {')
  if ($i3 -ge 0) {
    # Find the next top-level function after FaqItem
    $candidates = @('function EnrollModal', 'function DemoModal', 'function IITEnrollModal', 'function PricingPlans', 'function Stars')
    $i4 = -1
    foreach ($next in $candidates) {
      $pos = $c.IndexOf($next, $i3 + 10)
      if ($pos -gt $i3 -and ($i4 -eq -1 -or $pos -lt $i4)) {
        $i4 = $pos
      }
    }
    if ($i4 -gt $i3) {
      $c = $c.Substring(0, $i3) + $c.Substring($i4)
      $changed = $true
    }
  }

  if ($changed) {
    [System.IO.File]::WriteAllText($f.FullName, $c, (New-Object System.Text.UTF8Encoding($false)))
    $updated++
    Write-Host ('Done: ' + $f.Name + ' Stars:' + $c.Contains('function Stars(') + ' FaqItem:' + $c.Contains('function FaqItem('))
  }
}
Write-Host ('Total: ' + $updated)
