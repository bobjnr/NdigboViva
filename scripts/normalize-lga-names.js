const fs = require('fs');
const path = require('path');

// Read the JSON file
const filePath = path.join(__dirname, '..', 'src', 'lib', 'towns-by-lga.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Function to convert to Title Case
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Create new object with normalized keys
const normalized = {};
for (const [key, value] of Object.entries(data)) {
    const normalizedKey = toTitleCase(key);
    normalized[normalizedKey] = value;
}

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2));
console.log('Normalized LGA names to Title Case');
console.log('Sample:', Object.keys(normalized).slice(0, 5));
