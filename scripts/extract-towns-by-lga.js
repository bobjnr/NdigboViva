const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\Users\\Bob Jnr\\Downloads\\ndigbo-viva-blog\\NDIGBO_VIVA_DATABASE_ALL.csv';
const outputPath = 'c:\\Users\\Bob Jnr\\Downloads\\ndigbo-viva-blog\\src\\lib\\towns-by-lga.json';

function parseCSV(text) {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentField += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentField.trim());
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (currentField || currentRow.length > 0) {
                currentRow.push(currentField.trim());
                rows.push(currentRow);
                currentRow = [];
                currentField = '';
            }
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentField += char;
        }
    }
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField.trim());
        rows.push(currentRow);
    }
    return rows;
}

try {
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCSV(fileContent);

    // Skip header
    const dataRows = rows.slice(1);

    // Map to store LGA -> Set of Towns
    const lgaToTowns = {};

    dataRows.forEach(row => {
        // Column indices from the CSV:
        // 11: LGA, 13: TOWN
        const lga = row[11];
        const town = row[13];

        if (lga && town) {
            if (!lgaToTowns[lga]) {
                lgaToTowns[lga] = new Set();
            }
            lgaToTowns[lga].add(town);
        }
    });

    // Convert Sets to sorted arrays
    const result = {};
    Object.keys(lgaToTowns).sort().forEach(lga => {
        result[lga] = Array.from(lgaToTowns[lga]).sort();
    });

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    console.log('Towns by LGA generated successfully at ' + outputPath);
    console.log('Total LGAs:', Object.keys(result).length);
    console.log('Sample:', Object.keys(result).slice(0, 5));

} catch (err) {
    console.error('Error:', err);
}
