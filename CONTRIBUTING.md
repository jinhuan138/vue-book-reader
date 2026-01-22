## Clone the Repository

```bash
git clone https://github.com/jinhuan138/vue-book-reader.git
cd vue-book-reader
```

## Clone foliate

```bash
git clone --recurse-submodules https://github.com/johnfactotum/foliate.git 
```

## Install dependencies
```bash
pnpm install
````

## Delete pdfjs
PDF.js has been removed from the core library to optimize for Vite build and reduce bundle size. If you need PDF support, you can see https://jinhuan138.github.io/vue-book-reader/guide/tips/pdf_file.

```diff
- const pdfjsPath = path => new URL(`vendor/pdfjs/${path}`, import.meta.url).toString()

- import './vendor/pdfjs/pdf.mjs'
- const pdfjsLib = globalThis.pdfjsLib
- pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsPath('pdf.worker.mjs')
- 
- const fetchText = async url => await (await fetch(url)).text()
- 
- // https://github.com/mozilla/pdf.js/blob/642b9a5ae67ef642b9a8808fd9efd447e8c350e2/web/text_layer_builder.css
- const textLayerBuilderCSS = await fetchText(pdfjsPath('text_layer_builder.css'))
-
- //    https://github.com/mozilla/pdf.js/blob/642b9a5ae67ef642b9a8808fd9efd447e8c350e2/web/annotation_layer_builder.css
- const annotationLayerBuilderCSS = await fetchText(pdfjsPath('annotation_layer_builder.css'))
...
-        ${textLayerBuilderCSS}
-        ${annotationLayerBuilderCSS}
...
```

## Dev server

```bash
pnpm dev
```

## Build lib
```bash
pnpm build
```