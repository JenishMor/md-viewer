import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Copy, Check, X, RotateCcw } from "lucide-react"

interface EditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  initialValue: string // New prop for initial markdown content
  scrollRatio: number
  onScrollSync: (ratio: number) => void
  scrollSourceRef: React.MutableRefObject<"editor" | "preview" | null>
  isScrollSyncEnabled: boolean
}

export function Editor({
  value,
  onChange,
  initialValue,
  scrollRatio,
  onScrollSync,
  scrollSourceRef,
  isScrollSyncEnabled,
  className,
  ...props
}: EditorProps) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    onChange({ target: { value: "" } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  const handleReset = () => {
    onChange({ target: { value: initialValue } } as React.ChangeEvent<HTMLTextAreaElement>)
  }

  // Editor → Preview scroll sync
  const handleScroll = () => {
    if (!textareaRef.current || !isScrollSyncEnabled) return

    scrollSourceRef.current = "editor"

    const el = textareaRef.current
    const ratio =
      el.scrollTop / (el.scrollHeight - el.clientHeight)

    onScrollSync(ratio)
  }

  // Preview → Editor scroll sync
  useEffect(() => {
    if (
      !textareaRef.current ||
      !isScrollSyncEnabled ||
      scrollSourceRef.current !== "preview"
    )
      return

    const el = textareaRef.current
    el.scrollTop =
      scrollRatio * (el.scrollHeight - el.clientHeight)
  }, [scrollRatio])

  return (
    <div className="relative h-full w-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">Markdown Input</span>
            <div className="flex items-center space-x-2"> {/* Added a div to group buttons */}
                <button
                onClick={handleClear}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                title="Clear Markdown"
                >
                <X className="h-4 w-4" />
                </button>
                <button
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                title="Reset Markdown"
                >
                <RotateCcw className="h-4 w-4" />
                </button>
                <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
                title="Copy Markdown"
                >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
            </div>
        </div>
      <textarea
        ref={textareaRef}
        className={cn(
          "flex-1 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground",
          className
        )}
        value={value}
        onChange={onChange}
        placeholder="# Type your markdown here..."
        onScroll={handleScroll}
        spellCheck={false}
        {...props}
      />
    </div>
  )
}
