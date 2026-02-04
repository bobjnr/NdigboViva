const fs = require('fs');
const path = require('path');

const rawDataPath = path.join(__dirname, '../src/lib/nigeria-wards.json');
const outputPath = path.join(__dirname, '../src/lib/towns-by-lga.json');

const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));

const targetStates = ['abia', 'anambra', 'ebonyi', 'enugu', 'imo', 'delta', 'rivers'];

const toTitleCase = (str) => {
    if (!str) return '';
    // Handle mixed separators: hyphens, underscores, spaces
    return str.split(/[-_ ]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
};

const newTownsData = {};
const stateLgaMap = {};

rawData.forEach(stateItem => {
    if (stateItem.state && targetStates.includes(stateItem.state.toLowerCase())) {
        const stateName = toTitleCase(stateItem.state);
        stateLgaMap[stateName] = [];

        stateItem.lgas.forEach(lgaItem => {
            const lgaName = toTitleCase(lgaItem.lga);
            const wards = lgaItem.wards.map(w => toTitleCase(w)).sort();

            newTownsData[lgaName] = wards;
            stateLgaMap[stateName].push(lgaName);
        });

        stateLgaMap[stateName].sort();
    }
});

fs.writeFileSync(outputPath, JSON.stringify(newTownsData, null, 2));

console.log('Updated towns-by-lga.json');
console.log('LGA Mapping Summary:');
console.log(JSON.stringify(stateLgaMap, null, 2));
