const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[id]/ReviewClient.tsx', 'utf-8');

let count = 0;
content = content.replace(/<td><\/td>/g, (match) => {
    // Only replace the first 25 occurrences (which are the remark columns for questions 1-25)
    if (count < 25) {
        let i = count;
        count++;
        return `<td>{audit.remarks && audit.remarks[${i}] ? audit.remarks[${i}] : ''}</td>`;
    }
    return match;
});

fs.writeFileSync('src/app/dashboard/[id]/ReviewClient.tsx', content);
