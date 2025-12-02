"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/layout"
import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
import { ThemeProvider } from "@/components/theme-provider"

const DEFAULT_MARKDOWN = `# Markdown Formatter - Format & Beautify Markdown Online Free 🎯

Transform messy **markdown formatting** into clean, professional content! Our free **markdown formatter** fixes syntax errors, standardizes formatting, and lints your files with advanced **markdown formatting** rules.

## Why Use Our Markdown Formatter?

✅ **Free Forever** - **Format markdown online** with no limits or signup required  
✅ **Real-time Formatting** - Watch instant **markdown formatting** as you type  
✅ **Professional Linting** - Fix syntax issues with industry-standard rules  
✅ **Prettier Integration** - Uses professional **markdown formatter** engine  
✅ **Copy & Download** - Get clean **markdown formatting** instantly  
✅ **GitHub Compatible** - Perfect **markdown formatter** for README files  

> **Perfect for:** Developers, technical writers, and teams who need consistent **markdown formatting** standards!

## Common Formatting Issues This Tool Fixes

### Missing spaces in headings (this will be fixed!)
####  Extra spaces and trailing whitespace  
## Missing spaces after hash marks

**Inconsistent text formatting**,*missing spaces*, ~~poor spacing~~, and [poorly formatted links](https://example.com).

### Lists with formatting problems
- Unordered list item
 - Inconsistent indentation (will be fixed)
- Missing space after dash

1. Missing space after number
2. Proper formatting
   3. Wrong numbering sequence

### Code blocks need proper formatting
\`\`\`javascript
// Inconsistent indentation and spacing
function markdownFormatter() {
console.log("This will be properly formatted!");
  return "beautiful markdown";
}
\`\`\`

### Tables with formatting issues
|Column 1|Column 2|Spacing Issues|
|-------|---------|-------------|
|Data| Inconsistent spacing |Poor alignment|
| More data|  Extra spaces  | Trailing spaces  |

### Advanced Features Showcase

Our **markdown formatter** handles:
- 🔢 **Math equations**: $E = mc^2$ (LaTeX formatting preserved)  
- 😊 **Emojis**: Proper spacing and formatting maintained
- 📊 **Complex tables**: Automatic alignment and spacing
- 💻 **Code blocks**: Syntax highlighting preserved
- 🔗 **Links**: Proper URL formatting and validation
`

export default function Home() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full min-h-0">
          <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <Editor 
              value={markdown} 
              onChange={(e) => setMarkdown(e.target.value)} 
              className="flex-1"
            />
          </div>
          <div className="flex-1 rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
            <Preview content={markdown} />
          </div>
        </div>
      </Layout>
    </ThemeProvider>
  )
}
