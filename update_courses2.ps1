$base = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\course'
$q = [char]34

# Files with: BOM + CourseEnrollModal + Footer + Navbar + useState + TalkToCounsellor
$bomPattern = [char]0xEF + [char]0xBB + [char]0xBF + 'import CourseEnrollModal from ' + $q + '@/components/CourseEnrollModal' + $q + ';' + [char]13 + [char]10 + 'import Footer from ' + $q + '@/components/shared/Footer' + $q + ';' + [char]13 + [char]10 + 'import Navbar from ' + $q + '@/components/shared/Navbar' + $q + ';' + [char]13 + [char]10 + 'import { useState } from ' + $q + 'react' + $q + ';' + [char]13 + [char]10 + 'import TalkToCounsellorModal from ' + $q + '@/components/TalkToCounsellorModal' + $q + ';'
$bomReplacement = 'import { useState, lazy, Suspense } from ' + $q + 'react' + $q + ';' + [char]13 + [char]10 + 'import { Stars, FaqItem } from ' + $q + './_shared' + $q + ';' + [char]13 + [char]10 + 'import Footer from ' + $q + '@/components/shared/Footer' + $q + ';' + [char]13 + [char]10 + 'import Navbar from ' + $q + '@/components/shared/Navbar' + $q + ';' + [char]13 + [char]10 + [char]13 + [char]10 + 'const CourseEnrollModal = lazy(() => import(' + $q + '@/components/CourseEnrollModal' + $q + '));' + [char]13 + [char]10 + 'const TalkToCounsellorModal = lazy(() => import(' + $q + '@/components/TalkToCounsellorModal' + $q + '));'

# Files without BOM: CourseEnrollModal + Footer + Navbar + useState + TalkToCounsellor
$noBomPattern = 'import CourseEnrollModal from ' + $q + '@/components/CourseEnrollModal' + $q + ';' + [char]13 + [char]10 + 'import Footer from ' + $q + '@/components/shared/Footer' + $q + ';' + [char]13 + [char]10 + 'import Navbar from ' + $q + '@/components/shared/Navbar' + $q + ';' + [char]13 + [char]10 + 'import { useState } from ' + $q + 'react' + $q + ';' + [char]13 + [char]10 + 'import TalkToCounsellorModal from ' + $q + '@/components/TalkToCounsellorModal' + $q + ';'
$noBomReplacement = $bomReplacement

# Files with only TalkToCounsellor (no CourseEnrollModal at top) — BIM, Multimedia
$talkOnlyBomPattern = [char]0xEF + [char]0xBB + [char]0xBF + 'import Footer from ' + $q + '@/components/shared/Footer' + $q + ';' + [char]13 + [char]10 + 'import Navbar from ' + $q + '@/components/shared/Navbar' + $q + ';' + [char]13 + [char]10 + 'import { useState } from ' + $q + 'react' + $q + ';' + [char]13 + [char]10 + 'import TalkToCounsellorModal from ' + $q + '@/components/TalkToCounsellorModal' + $q + ';'
$talkOnlyReplacement = 'import { useState, lazy, Suspense } from ' + $q + 'react' + $q + ';' + [char]13 + [char]10 + 'import { Stars, FaqItem } from ' + $q + './_shared' + $q + ';' + [char]13 + [char]10 + 'import Footer from ' + $q + '@/components/shared/Footer' + $q + ';' + [char]13 + [char]10 + 'import Navbar from ' + $q + '@/components/shared/Navbar' + $q + ';' + [char]13 + [char]10 + [char]13 + [char]10 + 'const TalkToCounsellorModal = lazy(() => import(' + $q + '@/components/TalkToCounsellorModal' + $q + '));'

$files = Get-ChildItem $base -Filter '*.jsx' | Where-Object { $_.Name -ne '_shared.jsx' -and $_.Name -ne 'CourseMain.jsx' }
$updated = 0
foreach ($f in $files) {
  $c = [System.IO.File]::ReadAllText($f.FullName)
  if ($c.Contains('_shared')) { Write-Host ('Skip (already done): ' + $f.Name); continue }
  if (-not $c.Contains('TalkToCounsellorModal')) { Write-Host ('Skip (no modal): ' + $f.Name); continue }

  $orig = $c

  if ($c.Contains($bomPattern)) {
    $c = $c.Replace($bomPattern, $bomReplacement)
  } elseif ($c.Contains($noBomPattern)) {
    $c = $c.Replace($noBomPattern, $noBomReplacement)
  } elseif ($c.Contains($talkOnlyBomPattern)) {
    $c = $c.Replace($talkOnlyBomPattern, $talkOnlyReplacement)
  } else {
    Write-Host ('No pattern match: ' + $f.Name)
    continue
  }

  if ($c -ne $orig) {
    [System.IO.File]::WriteAllText($f.FullName, $c)
    $updated++
    Write-Host ('Done: ' + $f.Name)
  }
}
Write-Host ('Total: ' + $updated)
