import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import "highlight.js/styles/github-dark.css" 
import "katex/dist/katex.min.css" 
import { Download } from "lucide-react"

interface PreviewProps {
  content: string
  scrollRatio: number
  onScrollSync: (ratio: number) => void
  scrollSourceRef: React.MutableRefObject<"editor" | "preview" | null>
  isScrollSyncEnabled: boolean
}

export function Preview({
  content,
  scrollRatio,
  onScrollSync,
  scrollSourceRef,
  isScrollSyncEnabled,
}: PreviewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLElement>(null)
  const [showDownloadTooltip, setShowDownloadTooltip] = useState(false)


  // Editor → Preview scroll sync
  useEffect(() => {
    if (
      !scrollContainerRef.current ||
      !isScrollSyncEnabled ||
      scrollSourceRef.current !== "editor"
    )
      return

    const el = scrollContainerRef.current
    el.scrollTop =
      scrollRatio * (el.scrollHeight - el.clientHeight)
  }, [scrollRatio])


  // Preview → Editor scroll sync
  const handleScroll = () => {
    if (!scrollContainerRef.current || !isScrollSyncEnabled) return

    scrollSourceRef.current = "preview"

    const el = scrollContainerRef.current
    const ratio =
      el.scrollTop / (el.scrollHeight - el.clientHeight)

    onScrollSync(ratio)
  }

  const handleDownload = () => {
    if (previewRef.current) {
      const blob = new Blob([previewRef.current.innerHTML], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "preview.html"
      a.click()
      URL.revokeObjectURL(url)
    }
  }


  return (
    <div className="h-full w-full flex flex-col">
         <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">Preview</span>
            <div className="flex items-center space-x-2">
                <div
                    className="relative"
                    onMouseEnter={() => setShowDownloadTooltip(true)}
                    onMouseLeave={() => setShowDownloadTooltip(false)}
                >
                    <button
                        onClick={handleDownload}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                    {showDownloadTooltip && (
                        <span className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 pointer-events-none">
                            Download HTML
                        </span>
                    )}
                </div>
            </div>
        </div>
      <div 
        className="flex-1 overflow-auto p-4"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        <article 
            ref={previewRef} 
            className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-li:text-foreground prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-pre:bg-slate-900 prose-pre:border prose-pre:border-border [&_pre_code]:text-slate-50 text-foreground"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
            components={{
                a: ({ ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}
