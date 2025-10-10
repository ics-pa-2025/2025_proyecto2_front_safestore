import fs from 'fs'
import path from 'path'

// Read VITE_API_URL from environment (set by CI or npm scripts)
const val = process.env.VITE_API_URL || 'http://localhost:3000'
const out = `window.__ENV = { VITE_API_URL: "${val}" };\n`
const outPath = path.join(process.cwd(), 'public', 'env.js')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, out)
console.log('Wrote', outPath, 'with VITE_API_URL=', val)
