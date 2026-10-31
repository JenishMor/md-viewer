# MD Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A free, open-source, and online tool to view and edit Markdown files with a real-time preview.

**Live at: [mdviewer.in](https://mdviewer.in)**

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

See [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) for the audit, architecture notes, known limitations, and a manual QA checklist.

## Tech Stack

- [Next.js](https://nextjs.org/) - The React Framework for the Web
- [React](https://react.dev/) - A JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [React Markdown](https://github.com/remarkjs/react-markdown) - For rendering Markdown
- [Lucide React](https://lucide.dev/) - For icons

## Testing & CI/CD

This project includes a comprehensive testing setup with:

- ✅ **End-to-End Testing** with [Playwright](https://playwright.dev/)
- ✅ **Cross-Browser Testing** (Chromium, Firefox, WebKit)
- ✅ **Accessibility Testing** (WCAG 2.1 AA compliance)
- ✅ **Responsive Design Testing** (Mobile & Desktop)
- ✅ **Performance Testing** (Core Web Vitals)
- ✅ **GitHub Actions CI/CD** (Automated testing on PRs)

### Quick Start

```bash
# Install test dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npm test

# Run tests in UI mode (recommended)
npm run test:ui

# View test report
npm run test:report
```

### Documentation

- 📖 [Testing Quick Start Guide](TESTING_QUICKSTART.md) - Get started in 5 minutes
- 📚 [Complete Testing Documentation](TESTING.md) - Comprehensive testing guide
- 🔒 [Branch Protection Setup](BRANCH_PROTECTION.md) - Configure GitHub PR protection

### CI/CD Workflow

All pull requests to `main` automatically run:
- Cross-browser tests (Chrome, Firefox, Safari)
- Mobile responsiveness tests
- Accessibility compliance checks
- Performance benchmarks

PRs can only be merged when all tests pass ✅

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/md-viewer.git
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