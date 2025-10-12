import fs from 'fs'
import path from 'path'

// Read environment variables with production defaults
const apiUrl = process.env.VITE_API_URL || 'http://104.236.125.252:3000'
const authApiUrl = process.env.VITE_AUTH_API_URL || 'http://104.236.125.252:3001'

const out = `window.__ENV = { 
    VITE_API_URL: "${apiUrl}",
    VITE_AUTH_API_URL: "${authApiUrl}"
};\n`

const outPath = path.join(process.cwd(), 'public', 'env.js')
fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, out)
console.log('Wrote', outPath, 'with VITE_API_URL=', apiUrl, 'and VITE_AUTH_API_URL=', authApiUrl)
