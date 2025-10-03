"use client"

import type React from "react"
import type { FC } from "react"
import { AIInput } from "./ui/ai-input"

type TInputAreaProps = {
  promptValue: string
  setPromptValue: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean
  messages: { role: string; content: string }[]
  setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>
  handleChat: (messages?: { role: string; content: string }[]) => void
}

const FinalInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  messages,
  setMessages,
  handleChat,
}) => {
  function onSubmit(value: string) {
    const latestMessages = [...messages, { role: "user", content: value }]
    setPromptValue("")
    setMessages(latestMessages)
    handleChat(latestMessages)
  }

  return (
    <div className="w-full">
      <AIInput
        placeholder="Follow up question..."
        disabled={disabled}
        value={promptValue}
        onChange={setPromptValue}
        onSubmit={onSubmit}
        minHeight={52}
        maxHeight={200}
      />
    </div>
  )
}

export default FinalInputArea
