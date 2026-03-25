const fs = require('fs');
const file = 'src/components/GenealogyForm.tsx';
let code = fs.readFileSync(file, 'utf8');

// There are roughly 40 <select> fields.
// Their current class names are mostly:
// className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold"
// className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-gold focus:border-brand-gold"

const parts = code.split('<select');
for (let i = 1; i < parts.length; i++) {
  const endIdx = parts[i].indexOf('>');
  let tagBody = parts[i].substring(0, endIdx);
  
  // Find the 'value'
  const valMatch = tagBody.match(/value=\{([^}]+)\}/);
  if (!valMatch) continue;
  const val = valMatch[1];
  
  // Replace className="..."
  const classMatch = tagBody.match(/className="([^"]+)"/);
  if (classMatch) {
    const origClass = classMatch[1];
    const newClass = `className={\`${origClass} \${!(${val}) ? 'text-gray-500' : 'text-gray-900'}\`}`;
    parts[i] = tagBody.replace(classMatch[0], newClass) + parts[i].substring(endIdx);
  }
}

code = parts.join('<select');
fs.writeFileSync(file, code);
console.log('Done');
