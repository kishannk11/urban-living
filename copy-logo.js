const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'app', '(public)', 'logo-small.png');
const destination = path.join(__dirname, 'public', 'logo-small.png');

try {
    fs.copyFileSync(source, destination);
    console.log('✅ Logo copied successfully to public directory!');
    console.log(`From: ${source}`);
    console.log(`To: ${destination}`);
} catch (error) {
    console.error('❌ Error copying logo:', error.message);
}
