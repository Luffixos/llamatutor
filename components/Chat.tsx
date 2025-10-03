"use client"

import type React from "react"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import FinalInputArea from "./FinalInputArea"
import { useEffect, useRef, useState } from "react"

export default function Chat({
  messages,
  disabled,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
}: {
  messages: { role: string; content: string }[]
  disabled: boolean
  promptValue: string
  setPromptValue: React.Dispatch<React.SetStateAction<string>>
  setMessages: React.Dispatch<React.SetStateAction<{ role: string; content: string }[]>>
  handleChat: () => void
  topic: string
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollableContainerRef = useRef<HTMLDivElement>(null)
  const [didScrollToBottom, setDidScrollToBottom] = useState(true)

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" })
  }

  useEffect(() => {
    if (didScrollToBottom) {
      scrollToBottom()
    }
  }, [didScrollToBottom, messages])

  useEffect(() => {
    const el = scrollableContainerRef.current
    if (!el) {
      return
    }

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableContainerRef.current
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight)
      }
    }

    el.addEventListener("scroll", handleScroll)

    return () => {
      el.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="flex grow flex-col gap-6 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden bg-transparent pt-0 mx-auto w-full max-w-3xl rounded-none">
        <p className="mb-6 uppercase text-gray-600 text-xs font-normal tracking-tight">Topic: {topic}</p>
        <div ref={scrollableContainerRef} className="overflow-y-scroll">
          {messages.length > 2 ? (
            <div className="w-full flex flex-col gap-6">
              {messages.slice(2).map((message, index) =>
                message.role === "assistant" ? (
                  <div className="relative w-full" key={index}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      className="w-full text-base text-gray-800 leading-relaxed tracking-normal prose prose-base max-w-none
                        prose-p:my-5 prose-p:leading-8 prose-p:tracking-normal
                        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-gray-900
                        prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6
                        prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-5
                        prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-4
                        prose-h4:text-lg prose-h4:mt-5 prose-h4:mb-3
                        prose-ul:my-5 prose-ul:space-y-2.5 prose-ul:list-disc prose-ul:pl-6
                        prose-ol:my-5 prose-ol:space-y-2.5 prose-ol:list-decimal prose-ol:pl-6
                        prose-li:leading-8 prose-li:tracking-normal prose-li:my-1.5
                        prose-li:pl-2
                        prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-gray-900
                        prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6 prose-pre:overflow-x-auto
                        prose-blockquote:border-l-4 prose-blockquote:border-gray-400 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:my-6 prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50
                        prose-strong:font-bold prose-strong:text-gray-900
                        prose-em:italic prose-em:text-gray-800
                        prose-a:text-blue-600 prose-a:underline prose-a:font-medium prose-a:hover:text-blue-800
                        prose-hr:my-8 prose-hr:border-gray-300
                        prose-table:my-6 prose-th:font-semibold prose-th:text-left prose-th:p-3 prose-td:p-3"
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p key={index} className="ml-auto w-fit bg-gray-900 px-5 font-medium text-white py-2.5 rounded-full">
                    {message.content}
                  </p>
                ),
              )}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 py-5">
              {Array.from(Array(10).keys()).map((i) => (
                <div
                  key={i}
                  className={`${i < 5 && "hidden sm:block"} h-10 animate-pulse rounded-xl bg-gray-200`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <FinalInputArea
          disabled={disabled}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleChat={handleChat}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  )
}
