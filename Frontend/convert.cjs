const fs = require('fs');
const path = require('path');

function processFile(srcPath, destPath, componentName) {
  try {
    let src = path.join(__dirname, srcPath);
    let dest = path.join(__dirname, destPath);
    let html = fs.readFileSync(src, 'utf8');
    
    let match = html.match(/<\/nav>\s*([\s\S]*?)<footer/i);
    let body = match ? match[1] : html;

    // React JSX replacements
    body = body.replace(/class=/g, 'className=');
    body = body.replace(/stroke-width/g, 'strokeWidth');
    body = body.replace(/stroke-linecap/g, 'strokeLinecap');
    body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
    body = body.replace(/fill-rule/g, 'fillRule');
    body = body.replace(/clip-rule/g, 'clipRule');
    
    // HTML Entities
    body = body.replace(/&ndash;/g, '-');
    body = body.replace(/&mdash;/g, '—');
    body = body.replace(/&middot;/g, '·');
    body = body.replace(/&check;/g, '✓');
    body = body.replace(/&rarr;/g, '→');
    
    // Clean up comments
    body = body.replace(/<!--.*?-->/gs, '');
    
    // Self-closing tags fixing
    body = body.replace(/<br>/g, '<br />');
    body = body.replace(/<hr>/g, '<hr />');

    const jsx = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst ${componentName} = () => {\n  return (\n    <>\n${body}\n    </>\n  );\n};\n\nexport default ${componentName};`;
    
    fs.writeFileSync(dest, jsx);
    console.log(`Successfully created ${destPath}`);
  } catch (err) {
    console.error(`Error processing ${srcPath}:`, err.message);
  }
}

processFile('old_vanilla/index.html', 'src/pages/Home.jsx', 'Home');
processFile('old_vanilla/about.html', 'src/pages/About.jsx', 'About');
