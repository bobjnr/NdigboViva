const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\Users\\Bob Jnr\\Downloads\\ndigbo-viva-blog\\NDIGBO_VIVA_DATABASE_ALL.csv';
const outputPath = 'c:\\Users\\Bob Jnr\\Downloads\\ndigbo-viva-blog\\src\\lib\\genealogy-hierarchy.json';

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

    const hierarchy = {};

    dataRows.forEach(row => {
        // Columns: 13: TOWN, 14: QUARTER, 15: OBI, 16: CLAN, 17: VILLAGE, 18: KINDRED, 19: UMUNNA
        const town = row[13];
        const quarter = row[14];
        const obi = row[15];
        const clan = row[16];
        const village = row[17];
        const kindred = row[18];
        const umunna = row[19];

        if (!town) return;

        if (!hierarchy[town]) {
            hierarchy[town] = { quarters: {} };
        }

        if (quarter) {
            if (!hierarchy[town].quarters[quarter]) {
                hierarchy[town].quarters[quarter] = { obis: {} };
            }

            if (obi) {
                if (!hierarchy[town].quarters[quarter].obis[obi]) {
                    hierarchy[town].quarters[quarter].obis[obi] = { clans: {} };
                }

                if (clan) {
                    if (!hierarchy[town].quarters[quarter].obis[obi].clans[clan]) {
                        hierarchy[town].quarters[quarter].obis[obi].clans[clan] = { villages: {} };
                    }

                    if (village) {
                        if (!hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village]) {
                            hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village] = { kindreds: {} };
                        }

                        if (kindred) {
                            if (!hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village].kindreds[kindred]) {
                                hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village].kindreds[kindred] = [];
                            }

                            if (umunna && !hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village].kindreds[kindred].includes(umunna)) {
                                hierarchy[town].quarters[quarter].obis[obi].clans[clan].villages[village].kindreds[kindred].push(umunna);
                            }
                        }
                    }
                }
            }
        }
    });

    // Also build a simplified map for direct lookups if needed, or just use the tree.
    // The tree is good for cascading.

    fs.writeFileSync(outputPath, JSON.stringify(hierarchy, null, 2));
    console.log('Hierarchy generated successfully at ' + outputPath);

} catch (err) {
    console.error('Error:', err);
}
