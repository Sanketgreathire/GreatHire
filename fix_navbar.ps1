$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\components\shared\Navbar.jsx'
$lines = Get-Content $file
$idx = -1
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match 'InternshipMarquee jobs=\{jobs\}') {
        $idx = $i
        break
    }
}
Write-Host "Found at line $($idx+1)"
$newLine = '        {isRecruiter ? (<div className="flex items-center justify-center gap-3"><span className="text-white text-sm font-medium text-center">🤖 Introducing AI Calling Agent! AI calls and shortlists applicants 24/7 — Enjoy 25% off, launch offer live!</span><button onClick={() => window.open("https://greathire.in/contact", "_blank")} className="flex-shrink-0 bg-white text-purple-700 text-xs font-bold px-4 py-1.5 rounded-full hover:bg-purple-50 transition-colors">Know more</button></div>) : (<InternshipMarquee jobs={jobs} />)}'
$lines[$idx] = $newLine
Set-Content $file $lines
Write-Host "Done"
