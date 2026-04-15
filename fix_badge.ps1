$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\recruiter\AllApplicantsList.jsx'
$lines = Get-Content $file
# Find ": null}" line and check if next non-empty line is a stray </span>
$idx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match '^\s+\) : null\}$') {
        # Check next few lines for stray </span>
        for ($j = $i+1; $j -lt $i+4; $j++) {
            if ($lines[$j] -match '^\s+</span>\s*$') {
                $idx = $j
                break
            }
            if ($lines[$j].Trim() -ne '') { break }
        }
        break
    }
}
if ($idx -ge 0) {
    Write-Host "Removing stray </span> at line $($idx+1)"
    $result = $lines[0..($idx-1)] + $lines[($idx+1)..($lines.Length-1)]
    Set-Content $file $result
} else {
    Write-Host "Not found"
}
Write-Host "Done"
