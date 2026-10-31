export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
}

export const templateCategories = [
  { id: "readme", name: "README Sections" },
  { id: "docs", name: "Document Templates" },
  { id: "visual", name: "Diagrams, Charts & Math" },
];

export const templates: Template[] = [
  {
    id: "readme-header",
    name: "Project Header",
    description: "Title, badges, and description",
    category: "readme",
    content: `# Project Name

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

A brief description of what this project does and who it's for.

`,
  },
  {
    id: "readme-install",
    name: "Installation",
    description: "Setup and install steps",
    category: "readme",
    content: `## Installation

Install with npm:

\`\`\`bash
npm install my-project
\`\`\`

Or with yarn:

\`\`\`bash
yarn add my-project
\`\`\`

`,
  },
  {
    id: "readme-usage",
    name: "Usage / Quick Start",
    description: "Basic usage examples",
    category: "readme",
    content: `## Usage

\`\`\`javascript
import { myFunction } from 'my-project';

const result = myFunction('hello');
console.log(result);
\`\`\`

`,
  },
  {
    id: "readme-api",
    name: "API Reference",
    description: "API endpoint or function docs",
    category: "readme",
    content: `## API Reference

### \`functionName(param1, param2)\`

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`param1\`  | \`string\` | **Required**. Description  |
| \`param2\`  | \`number\` | Optional. Default: \`10\`    |

**Returns:** \`Promise<Result>\`

`,
  },
  {
    id: "readme-config",
    name: "Configuration",
    description: "Environment variables and config",
    category: "readme",
    content: `## Configuration

Create a \`.env\` file in the root directory:

\`\`\`env
API_KEY=your_api_key
DATABASE_URL=your_database_url
PORT=3000
\`\`\`

| Variable       | Description              | Default |
| :------------- | :----------------------- | :------ |
| \`API_KEY\`      | Your API key             | —       |
| \`DATABASE_URL\` | Database connection URL  | —       |
| \`PORT\`         | Server port              | \`3000\`  |

`,
  },
  {
    id: "readme-contributing",
    name: "Contributing",
    description: "Contribution guidelines",
    category: "readme",
    content: `## Contributing

Contributions are always welcome!

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

Please read the [contributing guidelines](CONTRIBUTING.md) first.

`,
  },
  {
    id: "readme-license",
    name: "License",
    description: "License section",
    category: "readme",
    content: `## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

`,
  },
  {
    id: "readme-faq",
    name: "FAQ",
    description: "Frequently asked questions",
    category: "readme",
    content: `## FAQ

#### How do I install this?

See the [Installation](#installation) section above.

#### Is this free to use?

Yes, this project is open source and free to use under the MIT license.

#### How do I report a bug?

Please open an issue on GitHub with a detailed description and steps to reproduce.

`,
  },
  {
    id: "doc-blog",
    name: "Blog Post",
    description: "Blog post structure with frontmatter",
    category: "docs",
    content: `---
title: "Your Blog Post Title"
date: ${new Date().toISOString().split("T")[0]}
author: "Your Name"
tags: ["tag1", "tag2"]
---

# Your Blog Post Title

A compelling introduction that hooks the reader and explains what they'll learn.

## The Problem

Describe the problem or question you're addressing.

## The Solution

Walk through your solution step by step.

## Key Takeaways

- First takeaway
- Second takeaway
- Third takeaway

## Conclusion

Wrap up and invite discussion.

`,
  },
  {
    id: "doc-meeting",
    name: "Meeting Notes",
    description: "Meeting minutes template",
    category: "docs",
    content: `# Meeting Notes — ${new Date().toISOString().split("T")[0]}

**Attendees:** Person A, Person B, Person C
**Facilitator:** Person A

## Agenda

1. Topic one
2. Topic two
3. Topic three

## Discussion Notes

### Topic One

- Key point discussed
- Decision made

### Topic Two

- Key point discussed
- Action item assigned

## Action Items

| Owner    | Task                  | Due Date   |
| :------- | :-------------------- | :--------- |
| Person A | Do the thing          | YYYY-MM-DD |
| Person B | Review the other thing| YYYY-MM-DD |

## Next Meeting

**Date:** TBD
**Topics:** TBD

`,
  },
  {
    id: "doc-changelog",
    name: "Changelog",
    description: "Keep a Changelog format",
    category: "docs",
    content: `# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature description

### Changed
- Updated feature description

### Fixed
- Bug fix description

## [1.0.0] — ${new Date().toISOString().split("T")[0]}

### Added
- Initial release
- Core functionality

`,
  },
  {
    id: "doc-proposal",
    name: "Project Proposal",
    description: "Technical project proposal",
    category: "docs",
    content: `# Project Proposal: Project Name

## Overview

Brief summary of the project and its goals.

## Problem Statement

What problem does this solve? Who is affected?

## Proposed Solution

Describe the technical approach at a high level.

## Scope

### In Scope
- Feature one
- Feature two

### Out of Scope
- Item one
- Item two

## Timeline

| Phase   | Duration | Deliverable         |
| :------ | :------- | :------------------ |
| Phase 1 | 2 weeks  | Prototype           |
| Phase 2 | 4 weeks  | MVP                 |
| Phase 3 | 2 weeks  | Testing & Launch    |

## Risks

1. **Risk one** — Mitigation strategy
2. **Risk two** — Mitigation strategy

## Success Metrics

- Metric one
- Metric two

`,
  },
  {
    id: "visual-flowchart",
    name: "Mermaid Flowchart",
    description: "Decision flow rendered as a diagram",
    category: "visual",
    content: `\`\`\`mermaid
flowchart TD
  A[Start] --> B{Valid?}
  B -->|Yes| C[Continue]
  B -->|No| D[Fix input]
  D --> B
\`\`\`

`,
  },
  {
    id: "visual-sequence",
    name: "Mermaid Sequence Diagram",
    description: "Messages between participants",
    category: "visual",
    content: `\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant A as App
  participant S as Server
  U->>A: Click "Save"
  A->>S: POST /documents
  S-->>A: 201 Created
  A-->>U: Show "Saved"
\`\`\`

`,
  },
  {
    id: "visual-gantt",
    name: "Mermaid Gantt Chart",
    description: "Project timeline",
    category: "visual",
    content: `\`\`\`mermaid
gantt
  title Release plan
  dateFormat YYYY-MM-DD
  section Build
    Design      :a1, 2026-01-05, 7d
    Implement   :a2, after a1, 14d
  section Ship
    Test        :a3, after a2, 5d
    Launch      :milestone, after a3, 0d
\`\`\`

`,
  },
  {
    id: "visual-bar-chart",
    name: "Bar Chart",
    description: "Chart.js bar chart from JSON",
    category: "visual",
    content: `\`\`\`chartjs
{
  "type": "bar",
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "datasets": [
      { "label": "2025", "data": [12, 19, 15, 22] },
      { "label": "2026", "data": [14, 23, 18, 27] }
    ]
  },
  "options": {
    "plugins": { "title": { "text": "Monthly sales" } },
    "scales": { "y": { "beginAtZero": true } }
  }
}
\`\`\`

`,
  },
  {
    id: "visual-pie-chart",
    name: "Pie Chart",
    description: "Chart.js pie chart from JSON",
    category: "visual",
    content: `\`\`\`chartjs
{
  "type": "pie",
  "data": {
    "labels": ["Docs", "Code", "Tests"],
    "datasets": [{ "label": "Time spent", "data": [30, 50, 20] }]
  },
  "options": { "plugins": { "title": { "text": "Where the week went" } } }
}
\`\`\`

`,
  },
  {
    id: "visual-math",
    name: "Math (KaTeX)",
    description: "Inline and display equations",
    category: "visual",
    content: `Inline math: $E = mc^2$, $\\sqrt{a^2 + b^2}$.

$$
\\begin{aligned}
  f(x) &= \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\\\
  A &= \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}
\\end{aligned}
$$

`,
  },
];
