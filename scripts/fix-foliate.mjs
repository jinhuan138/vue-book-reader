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
                return data` + chain.replace(/\n/g, '\n                    ') + ')})' + after

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

    // Find the start marker: `const pdfjsPath = path => new URL(`
    const pdfStartMarker = 'const pdfjsPath = path => new URL('
    const pdfEndMarker = 'const annotationLayerBuilderCSS = await fetchText(pdfjsPath(\'annotation_layer_builder.css\'))'
    const pdfStartIdx = pdfContent.indexOf(pdfStartMarker)
    const pdfEndIdx = pdfContent.indexOf(pdfEndMarker)

    if (pdfStartIdx === -1 || pdfEndIdx === -1) {
        console.log('[fix-foliate] pdf.js: targets not found, may already be modified')
    } else {
        const before = pdfContent.substring(0, pdfStartIdx)
        const after = pdfContent.substring(pdfEndIdx + pdfEndMarker.length)
        const replacement = "import textLayerBuilderCSS from './vendor/pdfjs/text_layer_builder.css?inline'\nimport annotationLayerBuilderCSS from './vendor/pdfjs/annotation_layer_builder.css?inline'"
        pdfContent = before + replacement + after

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
            console.log('[fix-foliate] pdf.js: patch verification failed')
        }
    }
} else {
    console.log('[fix-foliate] pdf.js already patched, skip')
}

// ============================================================
// 3. Fix view.js - getCFI defensive guard + labelFromPercentage
// ============================================================
const viewFile = join(__dirname, '..', 'src', 'packages', 'foliate-js', 'view.js')
let viewContent = readFileSync(viewFile, 'utf-8').replace(/\r\n/g, '\n')
let viewPatched = false

// 3a. Add defensive guard to getCFI
if (!viewContent.includes('if (index == null || !this.book?.sections?.[index])')) {
    const getCFIOriginal = '    getCFI(index, range) {\n        const baseCFI = this.book.sections[index].cfi ?? CFI.fake.fromIndex(index)'
    const getCFIPatched = '    getCFI(index, range) {\n        if (index == null || !this.book?.sections?.[index])\n            return CFI.fake.fromIndex(index ?? 0)\n        const baseCFI = this.book.sections[index].cfi ?? CFI.fake.fromIndex(index)'
    if (viewContent.includes(getCFIOriginal)) {
        viewContent = viewContent.replace(getCFIOriginal, getCFIPatched)
        viewPatched = true
        console.log('[fix-foliate] view.js: getCFI guard patched')
    } else {
        console.log('[fix-foliate] view.js: getCFI target not found, may already be modified')
    }
} else {
    console.log('[fix-foliate] view.js: getCFI already patched, skip')
}

// 3b. Add labelFromPercentage method after getCFI
if (!viewContent.includes('labelFromPercentage')) {
    const insertBefore = '    resolveCFI(cfi)'
    const insertIdx = viewContent.indexOf(insertBefore)
    if (insertIdx !== -1) {
        const labelMethod = '    labelFromPercentage(fraction) {\n        if (!this.#sectionProgress || !this.#tocProgress) return \'\'\n        const [index] = this.#sectionProgress.getSection(fraction)\n        const tocItem = this.#tocProgress.getProgress(index)\n        return tocItem?.label ?? \'\'\n    }\n'
        viewContent = viewContent.substring(0, insertIdx) + labelMethod + viewContent.substring(insertIdx)
        viewPatched = true
        console.log('[fix-foliate] view.js: labelFromPercentage added')
    } else {
        console.log('[fix-foliate] view.js: insertion point for labelFromPercentage not found')
    }
} else {
    console.log('[fix-foliate] view.js: labelFromPercentage already exists, skip')
}

if (viewPatched) writeFileSync(viewFile, viewContent)

// ============================================================
// 4. Fix epub.js - resolveHref returns invalid index (-1)
// ============================================================
const epubFile = join(__dirname, '..', 'src', 'packages', 'foliate-js', 'epub.js')
let epubContent = readFileSync(epubFile, 'utf-8').replace(/\r\n/g, '\n')

if (!epubContent.includes('if (index < 0) return null')) {
    const resolveOriginal = '        const index = this.resources.spine.findIndex(({ idref }) => idref === item.id)\n        const anchor = hash ? doc => getHTMLFragment(doc, hash) : () => 0'
    const resolvePatched = '        const index = this.resources.spine.findIndex(({ idref }) => idref === item.id)\n        if (index < 0) return null\n        const anchor = hash ? doc => getHTMLFragment(doc, hash) : () => 0'
    if (epubContent.includes(resolveOriginal)) {
        epubContent = epubContent.replace(resolveOriginal, resolvePatched)
        writeFileSync(epubFile, epubContent)
        console.log('[fix-foliate] epub.js: resolveHref guard patched')
    } else {
        console.log('[fix-foliate] epub.js: resolveHref target not found, may already be modified')
    }
} else {
    console.log('[fix-foliate] epub.js: resolveHref already patched, skip')
}
