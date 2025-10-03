"use client"

import type React from "react"
import type { FC } from "react"
import { AIInput } from "./ui/ai-input"

type TInputAreaProps = {
  promptValue: string
  setPromptValue: React.Dispatch<React.SetStateAction<string>>
  disabled?: boolean
  handleChat: (messages?: { role: string; content: string }[]) => void
  ageGroup: string
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>
  handleInitialChat: () => void
}

const InitialInputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  disabled,
  handleInitialChat,
  ageGroup,
  setAgeGroup,
}) => {
  return (
    <form
      className="mx-auto flex w-full flex-col items-center justify-between gap-4 sm:flex-row sm:gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        handleInitialChat()
      }}
    >
      <div className="flex w-full items-center gap-3">
        <AIInput
          placeholder="Teach me about..."
          disabled={disabled}
          value={promptValue}
          onChange={setPromptValue}
          onSubmit={handleInitialChat}
          minHeight={52}
          maxHeight={200}
        />
        <div className="flex h-[52px] shrink-0 items-center justify-center border border-gray-200 px-4 rounded-full bg-gray-50 transition hover:border-gray-900 hover:bg-gray-100">
          <select
            id="grade"
            name="grade"
            className="h-full border-0 bg-transparent text-gray-900 focus:outline-none focus:ring-0 font-normal text-base"
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value)}
          >
            <option>Elementary School</option>
            <option>Middle School</option>
            <option>High School</option>
            <option>College</option>
            <option>Undergrad</option>
            <option>Graduate</option>
          </select>
        </div>
      </div>
    </form>
  )
}

export default InitialInputArea
