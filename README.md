# MD Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A free, open-source, and online tool to view and edit Markdown files with a real-time preview.

**Live at: [mdviewer.in](https://www.mdviewer.in)**

![MD Viewer Screenshot](https://www.mdviewer.in/logo.png) 

## Key Features

- **Live Preview**: See your rendered Markdown as you type; rendering yields to typing on large documents.
- **Markdown and Visual modes**: Edit the source, or format visually (TipTap) without writing syntax. Unsupported syntax (math, raw HTML, frontmatter, footnotes) is preserved verbatim.
- **GFM Support**: Tables, task lists (clickable in the preview), footnotes, autolinks, strikethrough, and YAML/TOML frontmatter.
- **Mermaid diagrams**: ` ```mermaid ` blocks, lazy-loaded, theme-aware, with zoom and copy-source.
- **Charts**: ` ```chartjs ` blocks with validated JSON (no executable code).
- **Math Formulas**: KaTeX inline (`$…$`) and display (`$$…$$`) math.
- **Paste from Word / Google Docs**: Cleaned and converted to Markdown in the browser.
- **Local documents**: Multiple documents with autosave, rename, duplicate, delete with 30-day recovery, and "clear all local data". Stored in `localStorage` only — not synced or backed up.
- **Import / export**: Open `.md`/`.txt` files, download Markdown or standalone HTML, print to PDF via the browser, copy Markdown or rich HTML.
- **Share**: Opt-in share links that carry the document in the URL fragment, and copy-ready output for blog platforms.
- **Sanitized HTML**: Inline HTML is rendered through GitHub's allow-list; scripts and event handlers are removed.
- **Resizable, responsive layout** with editor-only, split and preview-only views, plus light and dark themes.

See [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) for the editor architecture, limitations and QA checklist, and [docs/SEO-UX-AUDIT.md](docs/SEO-UX-AUDIT.md) for the SEO and UX audit.

## Tech Stack

- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - For rendering Markdown
- [Lucide React](https://lucide.dev/) - For icons

## Testing & CI/CD

End-to-end tests use [Playwright](https://playwright.dev/) and run against a production build in two projects: Desktop Chrome and a mobile Chrome profile (Pixel 5). They cover Markdown rendering and sanitization, Mermaid and chart blocks, the visual editor and paste conversion, local documents and autosave, import/export, share links, responsive layout, and accessibility checks with axe-core (no critical or serious violations).

```bash
npm install
npx playwright install --with-deps chromium
npm test                # build, start and run all tests
npm run test:ui         # interactive mode
npm run test:report     # open the last HTML report
```

GitHub Actions runs the suite on every pull request to `main` and nightly (`.github/workflows/`).

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/JenishMor/md-viewer.git
   cd md-viewer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.