$file = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\recruiter\AllApplicantsList.jsx'
$lines = Get-Content $file
$newBlock = @(
'                  // Skills: profile first, then applicantProfile (snapshot at apply time), deduplicated',
'                  const profileSkills = Array.isArray(p.skills)',
'                    ? p.skills.flatMap(s => s.split('','').map(x => x.trim())).filter(Boolean)',
'                    : [];',
'                  const resumeSkills = Array.isArray(app.applicantProfile?.skills)',
'                    ? app.applicantProfile.skills.flatMap(s => s.split('','').map(x => x.trim())).filter(Boolean)',
'                    : [];',
'                  const skills = [...new Set([...profileSkills, ...resumeSkills].map(s => s.toLowerCase()))]',
'                    .map(s => s.charAt(0).toUpperCase() + s.slice(1));'
)
$result = $lines[0..333] + $newBlock + $lines[338..($lines.Length-1)]
Set-Content $file $result
Write-Host "Done"
