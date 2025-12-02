import * as React from "react"
import { cn } from "@/lib/utils"
import { Copy, Check } from "lucide-react"

interface EditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function Editor({ value, onChange, className, ...props }: EditorProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative h-full w-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
            <span className="text-sm font-medium text-muted-foreground">Markdown Input</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
              title="Copy Markdown"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </button>
        </div>
      <textarea
        className={cn(
          "flex-1 w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground",
          className
        )}
        value={value}
        onChange={onChange}
        placeholder="# Type your markdown here..."
        spellCheck={false}
        {...props}
      />
    </div>
  )
}
