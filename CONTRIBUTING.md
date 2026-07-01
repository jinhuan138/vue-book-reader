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

## Fix foliate-js patches

After cloning, you need to manually run the patch script once to apply two fixes to the foliate-js submodule:

```bash
pnpm run fix-foliate
```

1. **Delete pdfjs from core library** — Removes pdfjs-related code from `pdf.js` to optimize for Vite build and reduce bundle size. If you need PDF support, see https://jinhuan138.github.io/vue-book-reader/guide/tips/pdf_file.
2. **Fix CSS data type in paginator.js** — Handles non-string CSS data (e.g., `ArrayBuffer` or `Blob`) to prevent `data.replace is not a function` error.

## Development vue-book-reader

```bash
pnpm dev
```

## Build lib

```bash
pnpm build
```
