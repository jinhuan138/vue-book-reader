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
```

## Delete pdfjs

PDF.js has been removed from the core library to optimize for Vite build and reduce bundle size. If you need PDF support, you can see https://jinhuan138.github.io/vue-book-reader/guide/tips/pdf_file.

```diff
- const pdfjsPath = path => new URL(`vendor/pdfjs/${path}`, import.meta.url).toString()

- import './vendor/pdfjs/pdf.mjs'
- const pdfjsLib = globalThis.pdfjsLib
- pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsPath('pdf.worker.mjs')
```

```diff
- const fetchText = async url => await (await fetch(url)).text()
- const textLayerBuilderCSS = await fetchText(pdfjsPath('text_layer_builder.css'))
+ import textLayerBuilderCSS from './vendor/pdfjs/text_layer_builder.css?inline'
- const annotationLayerBuilderCSS = await fetchText(pdfjsPath('annotation_layer_builder.css'))
+ import annotationLayerBuilderCSS from './vendor/pdfjs/annotation_layer_builder.css?inline'
```

## Development vue-book-reader

```bash
pnpm dev
```

## Build lib

```bash
pnpm build
```
