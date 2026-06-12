const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/[id]/ReviewClient.tsx', 'utf-8');
content = content.replace(/\{audit\.remarks && audit\.remarks\[(\d+)\] \? audit\.remarks\[\1\] : ''\}/g, '{safeRemarks[$1] || ""}');
fs.writeFileSync('src/app/dashboard/[id]/ReviewClient.tsx', content);
console.log('Fixed remarks parsing in ReviewClient');
