# MD Viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A free, open-source, and online tool to view and edit Markdown files with a real-time preview.

**Live at: [mdviewer.in](https://mdviewer.in)**

![MD Viewer Screenshot](https://www.mdviewer.in/logo.png) 

## Key Features

- **Live Preview**: See your rendered Markdown instantly as you type.
- **Resizable Panels**: Adjust the editor and preview panels for a comfortable workspace on desktop.
- **Responsive Design**: A seamless experience on both desktop and mobile devices.
- **GFM Support**: Full support for GitHub Flavored Markdown, including tables, code blocks, and more.
- **Syntax Highlighting**: Code blocks are highlighted for better readability.
- **Math Formulas**: Write and preview math formulas using KaTeX.
- **Theme Toggle**: Switch between light and dark modes.
- **Persistent Content**: Your content is automatically saved to your browser's local storage.

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