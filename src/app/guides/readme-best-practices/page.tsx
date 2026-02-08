import { Metadata } from 'next';
import { Layout } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How to Write Perfect README Files: A Developer\'s Complete Guide | MDViewer',
  description: 'Master the art of README writing for GitHub. Learn structure, essential sections, badges, screenshots, and real examples that make your projects stand out and attract contributors.',
  keywords: [
    'readme best practices',
    'how to write readme',
    'github readme guide',
    'readme template',
    'readme examples',
    'open source readme',
    'project documentation',
    'readme.md guide',
  ],
  openGraph: {
    title: 'How to Write Perfect README Files: A Developer\'s Complete Guide',
    description: 'Master the art of README writing for GitHub. Learn structure, essential sections, badges, and examples that make your projects stand out.',
    url: 'https://mdviewer.in/guides/readme-best-practices',
    type: 'article',
  },
  authors: [{ name: 'MDViewer Team' }],
};

export default function ReadmeBestPracticesGuide() {
  return (
    <Layout>
      <article className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground transition-colors">Guides</Link>
          <span>/</span>
          <span className="text-foreground">README Best Practices</span>
        </nav>

        {/* Header */}
        <header className="space-y-6 border-b pb-10">
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">Documentation</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">12 min read</span>
            <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm">Updated Feb 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            How to Write Perfect README Files: A Developer's Complete Guide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your README is often the first thing people see when they discover your project. Learn how to write a README that clearly communicates your project's value, helps users get started quickly, and attracts contributors.
          </p>
        </header>

        {/* Table of Contents */}
        <nav className="bg-muted/50 rounded-2xl p-6 border">
          <h2 className="text-lg font-bold mb-4">📑 In This Guide</h2>
          <ul className="grid md:grid-cols-2 gap-2 text-sm">
            <li><a href="#why-readme-matters" className="text-primary hover:underline">Why Your README Matters</a></li>
            <li><a href="#essential-sections" className="text-primary hover:underline">Essential Sections</a></li>
            <li><a href="#project-title" className="text-primary hover:underline">Project Title & Description</a></li>
            <li><a href="#badges" className="text-primary hover:underline">Adding Badges</a></li>
            <li><a href="#installation" className="text-primary hover:underline">Installation Instructions</a></li>
            <li><a href="#usage" className="text-primary hover:underline">Usage Examples</a></li>
            <li><a href="#screenshots" className="text-primary hover:underline">Screenshots & GIFs</a></li>
            <li><a href="#contributing" className="text-primary hover:underline">Contributing Guidelines</a></li>
            <li><a href="#license" className="text-primary hover:underline">License Information</a></li>
            <li><a href="#complete-template" className="text-primary hover:underline">Complete Template</a></li>
          </ul>
        </nav>

        {/* Why README Matters */}
        <section id="why-readme-matters" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Why Your README Matters</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Think of your README as your project's landing page, elevator pitch, and user manual all rolled into one. When someone discovers your repository on GitHub, the README is typically the first thing they'll read. In those few seconds of attention, you need to:
            </p>
            <ul className="space-y-2">
              <li><strong>Communicate what your project does</strong> — and why it matters</li>
              <li><strong>Help users get started quickly</strong> — with clear installation and usage instructions</li>
              <li><strong>Build trust and credibility</strong> — through professional presentation</li>
              <li><strong>Attract contributors</strong> — by making it easy to understand how they can help</li>
            </ul>
            <p>
              A well-written README can be the difference between your project gaining traction or being ignored. Studies have shown that open-source projects with comprehensive READMEs receive significantly more stars and contributions than those without.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">💡 Real Impact</h4>
            <p className="text-blue-800 dark:text-blue-200">
              According to GitHub data, repositories with detailed READMEs are <strong>40% more likely</strong> to receive contributions from new developers. Your README is directly tied to your project's success.
            </p>
          </div>
        </section>

        {/* Essential Sections */}
        <section id="essential-sections" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Essential README Sections</h2>
          <p className="text-lg text-muted-foreground">
            While every project is different, most successful READMEs include these core sections. Think of this as your README checklist:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Project Title & Description</span>
              </div>
              <p className="text-sm text-muted-foreground">What is this project and why should anyone care?</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Badges</span>
              </div>
              <p className="text-sm text-muted-foreground">Quick status indicators (build, license, version)</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Installation</span>
              </div>
              <p className="text-sm text-muted-foreground">How to install and set up the project</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Usage Examples</span>
              </div>
              <p className="text-sm text-muted-foreground">Code examples showing how to use the project</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Screenshots/Demo</span>
              </div>
              <p className="text-sm text-muted-foreground">Visual representation of what the project does</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Contributing</span>
              </div>
              <p className="text-sm text-muted-foreground">How others can contribute to the project</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">License</span>
              </div>
              <p className="text-sm text-muted-foreground">Legal terms for using the project</p>
            </div>
            <div className="p-5 bg-card rounded-xl border space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-green-500 font-bold">✓</span>
                <span className="font-medium">Contact/Support</span>
              </div>
              <p className="text-sm text-muted-foreground">How to get help or reach the maintainers</p>
            </div>
          </div>
        </section>

        {/* Project Title & Description */}
        <section id="project-title" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Project Title & Description</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Your title and opening description are crucial for making a strong first impression. The title should be clear and memorable, while the description should quickly answer: <strong>"What does this project do, and why should I use it?"</strong>
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Best Practices for Titles</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Keep it short and memorable (1-3 words)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Make it descriptive of what the project does</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Avoid generic names like "my-project" or "test-app"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span>Consider adding a tagline beneath the title</span>
              </li>
            </ul>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm space-y-2">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">EXAMPLE</div>
            <div className="text-xl font-bold font-sans"># MDViewer</div>
            <div className="text-muted-foreground font-sans mt-2">
              &gt; A free, fast, and privacy-focused online Markdown editor with real-time preview.
            </div>
            <div className="font-sans mt-4">
              MDViewer is an open-source web application that lets developers and writers preview and edit Markdown files directly in the browser. Built with Next.js and React, it offers instant rendering, GitHub Flavored Markdown support, and stores all content locally for complete privacy.
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
            <strong className="text-amber-800 dark:text-amber-200">⚠️ Common Mistake:</strong>{' '}
            <span className="text-amber-700 dark:text-amber-300">Don't start with "This is a project that..." — get straight to the point. Lead with value, not filler words.</span>
          </div>
        </section>

        {/* Badges */}
        <section id="badges" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Adding Badges</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Badges (also called shields) provide quick visual indicators about your project's status. They help visitors instantly understand important information like build status, version, license, and test coverage.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">COMMON BADGES (using shields.io)</div>
            <div className="space-y-2">
              <div>![Build Status](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml)</div>
              <div>![License](https://img.shields.io/github/license/user/repo)</div>
              <div>![Version](https://img.shields.io/npm/v/package-name)</div>
              <div>![Downloads](https://img.shields.io/npm/dm/package-name)</div>
              <div>![Stars](https://img.shields.io/github/stars/user/repo)</div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-green-600 dark:text-green-400">✅ Do</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use badges that provide useful information</li>
                <li>• Keep badges on a single line for cleanliness</li>
                <li>• Update badges when project status changes</li>
                <li>• Use consistent badge styles</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-red-600 dark:text-red-400">❌ Don't</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Overload with too many badges (5-8 max)</li>
                <li>• Use badges that are always broken or red</li>
                <li>• Include vanity badges that don't help users</li>
                <li>• Mix different badge styles inconsistently</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Installation Instructions</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Clear installation instructions are critical. A user who can't install your project in 5 minutes will likely abandon it. Think step-by-step, assume nothing, and test your instructions on a fresh machine.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Key Principles</h3>
            <div className="grid gap-4">
              <div className="flex gap-4 items-start p-4 bg-card rounded-xl border">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400 text-sm">1</div>
                <div>
                  <h4 className="font-medium">List Prerequisites</h4>
                  <p className="text-sm text-muted-foreground">Specify required software, versions, and system requirements before installation steps.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-card rounded-xl border">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400 text-sm">2</div>
                <div>
                  <h4 className="font-medium">Provide Copy-Paste Commands</h4>
                  <p className="text-sm text-muted-foreground">Users should be able to copy commands directly. Use code blocks for all terminal commands.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-card rounded-xl border">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400 text-sm">3</div>
                <div>
                  <h4 className="font-medium">Cover Multiple Methods</h4>
                  <p className="text-sm text-muted-foreground">If applicable, show npm, yarn, and manual installation options.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start p-4 bg-card rounded-xl border">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 font-bold text-blue-600 dark:text-blue-400 text-sm">4</div>
                <div>
                  <h4 className="font-medium">Include Verification</h4>
                  <p className="text-sm text-muted-foreground">Show how users can verify the installation was successful.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">EXAMPLE INSTALLATION SECTION</div>
            <div className="font-sans space-y-4">
              <div className="text-lg font-bold">## Installation</div>
              <div className="text-base font-semibold">### Prerequisites</div>
              <div>- Node.js 18.0 or higher</div>
              <div>- npm or yarn</div>
              <div className="text-base font-semibold mt-4">### Quick Start</div>
              <div className="bg-slate-800 text-slate-100 p-3 rounded font-mono text-sm mt-2">
                <div># Clone the repository</div>
                <div>git clone https://github.com/user/project.git</div>
                <div className="mt-2"># Navigate to directory</div>
                <div>cd project</div>
                <div className="mt-2"># Install dependencies</div>
                <div>npm install</div>
                <div className="mt-2"># Start the development server</div>
                <div>npm run dev</div>
              </div>
              <div>Open http://localhost:3000 to view the app.</div>
            </div>
          </div>
        </section>

        {/* Usage */}
        <section id="usage" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Usage Examples</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              After installation, users need to know <em>how</em> to use your project. Provide practical code examples that demonstrate common use cases. Start with the simplest example and progressively show more advanced usage.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Tips for Great Usage Examples</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Show, don't tell:</strong> Actual code is worth more than paragraphs of explanation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Include comments:</strong> Explain what each section of code does.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Show expected output:</strong> Let users know what to expect when they run the code.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold mt-1">✓</span>
                <span><strong>Cover edge cases:</strong> Show handling of errors or unusual inputs.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Screenshots */}
        <section id="screenshots" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Screenshots & Demo GIFs</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Visual content is incredibly powerful. A well-placed screenshot or GIF can communicate your project's value faster than any written description. Users can immediately see what they're getting.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-card rounded-xl border space-y-3">
              <h3 className="font-semibold">📸 Screenshots</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Capture key features and interfaces</li>
                <li>• Use consistent image sizes</li>
                <li>• Add captions explaining each screenshot</li>
                <li>• Optimize file sizes for fast loading</li>
                <li>• Store in a /docs or /images folder</li>
              </ul>
            </div>
            <div className="p-6 bg-card rounded-xl border space-y-3">
              <h3 className="font-semibold">🎬 Demo GIFs</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Show workflows in action</li>
                <li>• Keep under 10 seconds if possible</li>
                <li>• Use tools like LICEcap or Gifox</li>
                <li>• Consider hosting large GIFs externally</li>
                <li>• Add play/pause controls for long demos</li>
              </ul>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">MARKDOWN FOR SCREENSHOTS</div>
            <div>## Screenshots</div>
            <div className="mt-2">### Light Mode</div>
            <div>![Light Mode Screenshot](./docs/images/light-mode.png)</div>
            <div className="mt-2">### Dark Mode</div>
            <div>![Dark Mode Screenshot](./docs/images/dark-mode.png)</div>
            <div className="mt-2">### Demo</div>
            <div>![Demo GIF](./docs/images/demo.gif)</div>
          </div>
        </section>

        {/* Contributing */}
        <section id="contributing" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Contributing Guidelines</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              If you want others to contribute to your project, make it easy for them. A clear contributing section removes friction and encourages participation. For larger projects, consider a separate CONTRIBUTING.md file.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">EXAMPLE CONTRIBUTING SECTION</div>
            <div className="font-sans space-y-3">
              <div className="text-lg font-bold">## Contributing</div>
              <div>Contributions are welcome! Here's how you can help:</div>
              <div className="mt-2">1. Fork the repository</div>
              <div>2. Create a feature branch (`git checkout -b feature/amazing-feature`)</div>
              <div>3. Commit your changes (`git commit -m 'Add amazing feature'`)</div>
              <div>4. Push to the branch (`git push origin feature/amazing-feature`)</div>
              <div>5. Open a Pull Request</div>
              <div className="mt-2">Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.</div>
            </div>
          </div>
        </section>

        {/* License */}
        <section id="license" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">License Information</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
            <p>
              Every open-source project should clearly state its license. This tells users and potential contributors what they can and cannot do with your code. Common licenses include MIT, Apache 2.0, and GPL.
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm">
            <div className="text-xs text-muted-foreground mb-4 font-sans font-medium">EXAMPLE LICENSE SECTION</div>
            <div className="font-sans">
              <div className="text-lg font-bold">## License</div>
              <div className="mt-2">This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.</div>
            </div>
          </div>
        </section>

        {/* Complete Template */}
        <section id="complete-template" className="space-y-6 scroll-mt-20">
          <h2 className="text-3xl font-bold">Complete README Template</h2>
          <p className="text-lg text-muted-foreground">
            Here's a complete, copy-paste-ready README template that incorporates all the best practices we've discussed:
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border font-mono text-sm overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-xs">
{`# Project Name

> One-line description of what your project does and why it's awesome.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-1.0.0-orange)

![Demo Screenshot](./docs/demo.png)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

A paragraph explaining what your project is and the problem it solves.
Include the motivation behind creating it and who it's for.

## Features

- ✅ Feature one
- ✅ Feature two
- ✅ Feature three
- 🚧 Upcoming feature

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/username/project-name.git

# Navigate to directory
cd project-name

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Usage

\`\`\`javascript
import { feature } from 'project-name';

// Basic usage
const result = feature.doSomething();
console.log(result);
\`\`\`

For more examples, see the [documentation](./docs/README.md).

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

Distributed under the MIT License. See \`LICENSE\` for more information.

## Contact

Your Name - [@twitter](https://twitter.com/username) - email@example.com

Project Link: [https://github.com/username/project-name](https://github.com/username/project-name)`}
            </pre>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-3xl p-8 md:p-12 border border-blue-200 dark:border-blue-800 text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Writing Your README</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Use our live Markdown editor to write and preview your README in real-time. Copy the template above and customize it for your project.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
            >
              Open Editor
            </Link>
            <Link 
              href="/guides"
              className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-border px-8 text-base font-medium shadow transition-all hover:bg-accent hover:shadow-lg"
            >
              More Guides
            </Link>
          </div>
        </section>

        {/* Related Guides */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Related Guides</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/guides/github-flavored-markdown" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">GitHub Flavored Markdown Guide →</h3>
              <p className="text-sm text-muted-foreground mt-2">Master all the GFM features you can use in your READMEs.</p>
            </Link>
            <Link href="/guides/technical-documentation" className="group p-6 bg-card rounded-2xl border hover:shadow-lg transition-all">
              <h3 className="font-bold group-hover:text-primary transition-colors">Technical Documentation Guide →</h3>
              <p className="text-sm text-muted-foreground mt-2">Learn professional documentation techniques beyond READMEs.</p>
            </Link>
          </div>
        </section>
      </article>
    </Layout>
  );
}
