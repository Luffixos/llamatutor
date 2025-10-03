"use client"

import { CornerRightUp, Mic } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea"

interface AIInputProps {
  id?: string
  placeholder?: string
  minHeight?: number
  maxHeight?: number
  onSubmit?: (value: string) => void
  className?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}

export function AIInput({
  id = "ai-input",
  placeholder = "Type your message...",
  minHeight = 52,
  maxHeight = 200,
  onSubmit,
  className,
  value: controlledValue,
  onChange: controlledOnChange,
  disabled,
}: AIInputProps) {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  })
  const [internalValue, setInternalValue] = useState("")

  // Use controlled value if provided, otherwise use internal state
  const inputValue = controlledValue !== undefined ? controlledValue : internalValue
  const setInputValue = controlledOnChange || setInternalValue

  useEffect(() => {
    adjustHeight()
  }, [inputValue, adjustHeight])

  const handleReset = () => {
    if (!inputValue.trim()) return
    onSubmit?.(inputValue)
    if (controlledValue === undefined) {
      setInputValue("")
    }
    adjustHeight(true)
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto w-full max-w-3xl">
        <Textarea
          id={id}
          placeholder={placeholder}
          className={cn(
            "max-w-3xl rounded-3xl border border-gray-200 bg-white pl-6 pr-16",
            "text-wrap text-black placeholder:text-black/50",
            "resize-none overflow-y-auto",
            "ring-black/20 focus-visible:ring-0 focus-visible:ring-offset-0",
            "py-[16px] leading-[1.2]",
            "transition-[height] duration-100 ease-out",
            `min-h-[${minHeight}px]`,
            `max-h-[${maxHeight}px]`,
            "[&::-webkit-resizer]:hidden",
          )}
          ref={textareaRef}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value)
            adjustHeight()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleReset()
            }
          }}
        />

        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 bg-black/5 transition-all duration-200 py-1.5 px-1.5 rounded-full",
            inputValue ? "right-12" : "right-3",
          )}
        >
          <Mic className="h-4 w-4 text-black/70" />
        </div>
        <button
          onClick={handleReset}
          type="button"
          disabled={disabled}
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 rounded-full",
            "bg-gray-900 py-1.5 px-1.5 rounded-full",
            "transition-all duration-200",
            inputValue ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <CornerRightUp className="h-4 w-4 text-gray-50" />
        </button>
      </div>
    </div>
  )
}
