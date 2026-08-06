const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
// Allow nav-link with other classes like is-active
const pattern = /<a([^>]*?href="([^"]+)"[^>]*?class="[^"]*nav-link[^"]*"[^>]*?aria-haspopup="true"[^>]*?)>\s*([^<]+?)\s*<svg class="chevron"([^>]+)><path([^>]+)><\/svg>\s*<\/a>/gi;

let totalUpdated = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let replaced = false;
    let newContent = content.replace(pattern, (match, p1, p2, p3, p4, p5) => {
        replaced = true;
        let attrs = p1.replace(/\s*aria-haspopup="true"/i, '');
        let text = p3.trim();
        return `<div class="nav-link-wrapper">
            <a${attrs}>
              ${text}
            </a>
            <button class="dropdown-toggle" aria-label="Toggle dropdown" aria-haspopup="true" aria-expanded="false">
              <svg class="chevron"${p4}><path${p5}></svg>
            </button>
          </div>`;
    });
    
    if (replaced) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
        totalUpdated++;
    }
});

console.log(`Finished updating ${totalUpdated} files.`);
