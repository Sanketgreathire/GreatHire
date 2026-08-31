with open('controllers/job.controller.js', 'rb') as f:
    content = f.read()

lines = content.split(b'\n')
out = []
i = 0

while i < len(lines):
    line = lines[i]

    # Conflict 1 at index 455: getAllJobs - keep HEAD (clean query logic)
    if i == 455 and line == b'<<<<<<< HEAD':
        out.append(b'    let query = {};')
        out.append(b'')
        out.append(b'    if (isProduction) {')
        out.append(b'      const verifiedCompanyIds = await Company.find({ isActive: true }).distinct("_id");')
        out.append(b'      query = { "jobDetails.isActive": true, company: { $in: verifiedCompanyIds } };')
        out.append(b'    }')
        out.append(b'')
        out.append(b'    const jobs = await Job.find(query)')
        # skip until end marker inclusive
        while i < len(lines) and b'>>>>>>> 0db4679e2e4540e959addd53a206c00dd65ccd00' not in lines[i]:
            i += 1
        i += 1  # skip the end marker line
        continue

    # Conflict 2 at index 1193: empty HEAD block before nested conflict - just remove all markers
    # This is the triple-nested conflict at bottom of file (searchJobs vs testAutoApply)
    # Keep: testAutoApply function only
    if i == 1193 and line == b'<<<<<<< HEAD':
        # skip the empty HEAD section (just the marker and =======)
        i += 1  # skip <<<<<<< HEAD
        # next line should be =======
        if i < len(lines) and lines[i] == b'=======':
            i += 1  # skip =======
        continue

    # Inner <<<<<<< HEAD at index 1195 (after outer ======= was skipped above, renumbered)
    # We'll handle by checking content
    if line == b'<<<<<<< HEAD' and i > 1000:
        # skip until we find >>>>>>> b45073ac or >>>>>>> 0db4679
        # keep the content between ======= and the end marker (the testAutoApply version)
        inner_lines = []
        i += 1
        in_keep = False
        while i < len(lines):
            l = lines[i]
            if l == b'=======':
                in_keep = True
                i += 1
                continue
            if b'>>>>>>> b45073ac' in l or b'>>>>>>> 0db4679' in l:
                i += 1
                break
            if in_keep:
                inner_lines.append(l)
            i += 1
        out.extend(inner_lines)
        continue

    if b'>>>>>>> b45073ac' in line or b'>>>>>>> 0db4679' in line:
        i += 1
        continue

    out.append(line)
    i += 1

with open('controllers/job.controller.js', 'wb') as f:
    f.write(b'\n'.join(out))

print('Done. Lines:', len(out))

# Verify no markers remain
remaining = [i+1 for i, l in enumerate(out) if b'<<<<<<<' in l or b'>>>>>>>' in l]
print('Remaining conflict lines:', remaining)
