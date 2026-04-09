$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\recruiter\candidate\CandidateList.jsx'
$lines = Get-Content $file
$good1 = $lines[0..327]
$good2 = $lines[348..($lines.Length-1)]
$result = $good1 + $good2
Set-Content $file $result
Write-Host "Done"
