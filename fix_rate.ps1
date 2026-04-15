$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\BackEnd\index.js'
$content = Get-Content $file -Raw
$content = $content.Replace('  max: 200,', '  max: 1000,')
Set-Content $file $content -NoNewline
Write-Host "Done"
