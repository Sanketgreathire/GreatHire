$path = 'd:\Worknew\GREATHIRE\REAL\GreatHire\frontend\src\pages\course\python.jsx'
$bytes = [System.IO.File]::ReadAllBytes($path)
$c = [System.Text.Encoding]::UTF8.GetString($bytes)
$i3 = $c.IndexOf('function FaqItem({ item }) {')
$i4 = $c.IndexOf('function DemoModal')
Add-Content 'd:\fix_python_log.txt' ("FaqItem at " + $i3 + " DemoModal at " + $i4)
if ($i3 -ge 0 -and $i4 -gt $i3) {
  $c = $c.Substring(0, $i3) + $c.Substring($i4)
  [System.IO.File]::WriteAllText($path, $c, (New-Object System.Text.UTF8Encoding($false)))
  Add-Content 'd:\fix_python_log.txt' ("Done. FaqItem: " + $c.Contains('function FaqItem('))
} else {
  Add-Content 'd:\fix_python_log.txt' "Not found"
}
