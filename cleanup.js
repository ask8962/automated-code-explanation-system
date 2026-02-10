const fs = require('fs');
const path = require('path');

const paths = ['.next', 'node_modules', 'package-lock.json'];

paths.forEach(p => {
    const fullPath = path.join(process.cwd(), p);
    if (fs.existsSync(fullPath)) {
        console.log(`Deleting ${p}...`);
        try {
            fs.rmSync(fullPath, { recursive: true, force: true });
            console.log(`Deleted ${p}`);
        } catch (e) {
            console.error(`Failed to delete ${p}: ${e.message}`);
        }
    } else {
        console.log(`${p} does not exist.`);
    }
});
