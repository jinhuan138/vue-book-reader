import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ============================================================
// 1. Fix paginator.js - CSS data type issue
// ============================================================
const paginatorFile = join(__dirname, '..', 'src', 'packages', 'foliate-js', 'paginator.js')

let content = readFileSync(paginatorFile, 'utf-8').replace(/\r\n/g, '\n')

if (!content.includes('ensure data is a string before calling replace')) {
    // Find the .then(data => data block
    const startMarker = '.then(data => data\n                // unprefix'
    const startIdx = content.indexOf(startMarker)

    if (startIdx === -1) {
        console.log('[fix-foliate] paginator.js: target not found, may already be modified')
    } else {
        // Find the closing )) after the last .replace chain
        // The block ends with: ...column`))\n        })
        const searchFrom = content.indexOf('break-${x}: ${y', startIdx)
        const closeIdx = content.indexOf('))', searchFrom)

        if (closeIdx === -1) {
            console.log('[fix-foliate] paginator.js: closing )) not found')
        } else {
            // Replace from .then(data => data through ))
            const before = content.substring(0, startIdx)
            const after = content.substring(closeIdx + 2) // skip the ))

            // Extract the replace chain (between data => data and the closing ))
            const chain = content.substring(startIdx + '.then(data => data'.length, closeIdx)

            const patched = before + `.then(data => {
                // ensure data is a string before calling replace
                if (typeof data !== 'string') {
                    if (data instanceof ArrayBuffer)
                        data = new TextDecoder('utf-8').decode(data)
                    else if (data instanceof Blob)
                        return data.text()
                    else
                        return data
                }
                return data` + chain.replace(/\n/g, '\n                    ') + '})' + ')' + after

            writeFileSync(paginatorFile, patched)
            console.log('[fix-foliate] paginator.js patched')
        }
    }
} else {
    console.log('[fix-foliate] paginator.js already patched, skip')
}

// ============================================================
// 2. Fix pdf.js - Remove pdfjs from core library
// ============================================================
const pdfFile = join(__dirname, '..', 'src', 'packages', 'foliate-js', 'pdf.js')

let pdfContent = readFileSync(pdfFile, 'utf-8').replace(/\r\n/g, '\n')

// Check if already patched
if (!pdfContent.includes("import textLayerBuilderCSS from './vendor/pdfjs/text_layer_builder.css?inline'")) {

    // Match the entire header block and replace in one shot
    const headerRegex = /const pdfjsPath = path => new URL\(`vendor\/pdfjs\/\$\{path\}`.*?\)\.toString\(\)\n\nimport '\.\/vendor\/pdfjs\/pdf\.mjs'\nconst pdfjsLib = globalThis\.pdfjsLib\npdfjsLib\.GlobalWorkerOptions\.workerSrc = pdfjsPath\('pdf\.worker\.mjs'\)\n\nconst fetchText = async url => await \(await fetch\(url\)\)\.text\(\)\n\n\/\/.*?\nconst textLayerBuilderCSS = await fetchText\(pdfjsPath\('text_layer_builder\.css'\)\)\n\n\/\/.*?\nconst annotationLayerBuilderCSS = await fetchText\(pdfjsPath\('annotation_layer_builder\.css'\)\)/

    const replacement = `import textLayerBuilderCSS from './vendor/pdfjs/text_layer_builder.css?inline'
import annotationLayerBuilderCSS from './vendor/pdfjs/annotation_layer_builder.css?inline'`

    if (headerRegex.test(pdfContent)) {
        pdfContent = pdfContent.replace(headerRegex, replacement)
    }

    // Remove cMapUrl and standardFontDataUrl
    const cMapRegex = /\n\s+cMapUrl: pdfjsPath\('cmaps\/'\),\n\s+standardFontDataUrl: pdfjsPath\('standard_fonts\/'\),\n/
    if (cMapRegex.test(pdfContent)) {
        pdfContent = pdfContent.replace(cMapRegex, '\n')
    }

    // Verify the patch was applied
    if (pdfContent.includes("import textLayerBuilderCSS from './vendor/pdfjs/text_layer_builder.css?inline'")) {
        writeFileSync(pdfFile, pdfContent)
        console.log('[fix-foliate] pdf.js patched')
    } else {
        console.log('[fix-foliate] pdf.js: targets not found, may already be modified')
    }
} else {
    console.log('[fix-foliate] pdf.js already patched, skip')
}
