$f = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\recruiter\RecruiterDashboard.jsx'
$c = Get-Content $f -Raw

# Wrap the dynamic import in an async IIFE inside useEffect
$c = $c -replace "const \{ io: ioLib \} = await import\('socket\.io-client'\);", "(async () => { const { io: ioLib } = await import('socket.io-client');"

# Find the socket.on planExpired return and close the IIFE before the useEffect return
$c = $c -replace "(socketRef\.current = socket;)", '$1' + "`n"

Set-Content $f $c -NoNewline
Write-Host "Done"
