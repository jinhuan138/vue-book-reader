## Clone the Repository

```bash
git clone https://github.com/jinhuan138/vue-book-reader.git
cd vue-book-reader
```

## Clone foliate

```bash
git clone --recurse-submodules https://github.com/johnfactotum/foliate-js.git src/packages/foliate-js
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

```diff
- cMapUrl: pdfjsPath('cmaps/'),
- standardFontDataUrl: pdfjsPath('standard_fonts/'),
```

## Fix CSS data type issue in paginator.js

Some EPUB books may have CSS files with non-string data types (e.g., `ArrayBuffer` or `Blob`), which can cause `data.replace is not a function` error in `paginator.js`.

In `src/packages/foliate-js/paginator.js`, in the `open()` method, the `data` event handler should check the type of `data` before calling `.replace()`:

```diff
- detail.data = Promise.resolve(detail.data).then(data => data
-     .replace(...))
+ detail.data = Promise.resolve(detail.data).then(data => {
+     if (typeof data !== 'string') {
+         if (data instanceof ArrayBuffer)
+             data = new TextDecoder('utf-8').decode(data)
+         else if (data instanceof Blob)
+             return data.text()
+         else
+             return data
+     }
+     return data.replace(...)
+ })
```

## Development vue-book-reader

```bash
pnpm dev
```

## Build lib

```bash
pnpm build
```
