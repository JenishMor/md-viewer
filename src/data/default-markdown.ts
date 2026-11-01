import { AI_ENABLED } from "@/lib/ai/actions";

const AI_TIP = AI_ENABLED
  ? `
> **New: AI assist (beta).** Select some text and click **AI** in the toolbar to improve the writing, fix grammar, shorten it, explain it, or turn rough notes into Markdown. Nothing is sent until you choose an action.
`
  : "";

export const DEFAULT_MARKDOWN = `# Welcome to MDViewer

Type in the editor and the preview updates as you go. This sample shows what MDViewer can render — edit it, or replace it with your own document.
${AI_TIP}
## Open your own file

Use **Open file** above the editor, drag a \`.md\` file onto it, or paste text. Your documents are saved in this browser, not uploaded. Prefer formatting buttons to syntax? Switch to **Visual** mode.

## Formatting

Text can be **bold**, *italic*, ~~struck through~~ or \`inline code\`. Links look like [the Markdown tutorial](https://www.mdviewer.in/markdown-tutorial), and plain URLs such as https://www.mdviewer.in become links automatically. Footnotes work too.[^1]

> Blockquotes are handy for tips and callouts.

## Lists and tasks

1. Write your draft
2. Check the preview
   - Nested items are indented
3. Export or share

- [x] GitHub Flavored Markdown
- [x] Tables, task lists and footnotes
- [ ] Tick this box in the preview — the source updates too

## Tables

Columns can be aligned left, center or right.

| Format | Syntax          | Shortcut |
| :----- | :-------------: | -------: |
| Bold   | \`**text**\`      |   Ctrl+B |
| Italic | \`*text*\`        |   Ctrl+I |
| Link   | \`[text](url)\`   |   Ctrl+K |

## Code with syntax highlighting

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Diagrams (Mermaid)

\`\`\`mermaid
flowchart LR
    A[Write Markdown] --> B{Looks right?}
    B -- Yes --> C[Export or share]
    B -- No --> A
\`\`\`

## Charts (Chart.js)

\`\`\`chartjs
{
  "type": "bar",
  "data": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "datasets": [{ "label": "Words written", "data": [320, 450, 280, 610, 520] }]
  },
  "options": { "plugins": { "title": { "text": "Words written this week" } } }
}
\`\`\`

## Math (KaTeX)

Inline math like $E = mc^2$, or a block:

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## Collapsible sections

<details>
<summary>Click to expand</summary>

Hidden details stay out of the way until needed. Keys can be shown as <kbd>Ctrl</kbd> + <kbd>P</kbd>.

</details>

---

**Next:** press <kbd>Ctrl</kbd> + <kbd>P</kbd> for every command, open **Templates** for ready-made documents, or use **Export** for HTML and PDF.

[^1]: Footnotes appear at the end of the document.
`;
