import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import "highlight.js/styles/github-dark.css" 
import "katex/dist/katex.min.css" 

interface PreviewProps {
  content: string
}

export function Preview({ content }: PreviewProps) {
  return (
    <div className="h-full w-full flex flex-col">
         <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
        </div>
      <div className="flex-1 overflow-auto p-4">
        <article className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-pre:bg-slate-900 prose-pre:border prose-pre:border-border text-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
                // Custom components if needed, e.g. for links to open in new tab
                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
