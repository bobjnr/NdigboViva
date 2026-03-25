const fs = require('fs');
const file = 'src/components/GenealogyForm.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace standard tailwind styling for the placeholder so it appears faded correctly
code = code.replace(/'text-gray-500'/g, "'text-gray-400 font-normal opacity-60'");

fs.writeFileSync(file, code);
console.log('Successfully faded placeholders');
