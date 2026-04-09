$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\recruiter\AllApplicantsList.jsx'
$content = Get-Content $file -Raw
$content = $content.Replace('fullname || "?""}</p>', 'fullname || "-"}</p>')
$content = $content.Replace('-? Most Preferred', '⭐ Most Preferred')
$content = $content.Replace('dY' + [char]15 + '- {score}%', '🤖 {score}%')
Set-Content $file $content -NoNewline
Write-Host "Done"
