"use client"

import type React from "react"

import Image from "next/image"
import type { FC } from "react"
import mobileImg from "../public/screenshot-mobile.png"
import InitialInputArea from "./InitialInputArea"
import { suggestions } from "@/utils/utils"

type THeroProps = {
  promptValue: string
  setPromptValue: React.Dispatch<React.SetStateAction<string>>
  handleChat: (messages?: { role: string; content: string }[]) => void
  ageGroup: string
  setAgeGroup: React.Dispatch<React.SetStateAction<string>>
  handleInitialChat: () => void
}

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleChat,
  ageGroup,
  setAgeGroup,
  handleInitialChat,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value)
  }

  return (
    <>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center sm:mt-24">
        <a
          className="mb-6 inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 h-9 px-3"
          href="https://togetherai.link/"
          target="_blank"
          rel="noreferrer"
        >
          <Image unoptimized src="/togethercomputer.png" alt="hero" width={18} height={18} />
          <span className="text-center tracking-tight text-sm font-light">
            Powered by <b className="font-medium text-gray-800">Llama 3.1</b> and{" "}
            <b className="text-sm font-medium text-gray-800">Together AI</b>
          </span>
        </a>
        <h2 className="mt-2 text-center text-5xl tracking-tight text-gray-900 leading-10 sm:text-5xl font-medium">
          Your Personal{" "}
          <span className="bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">Tutor</span>
        </h2>
        <p className="mt-6 max-w-xl text-balance text-center text-gray-600 tracking-tight text-base leading-7">
          Enter a topic and the education level you want to be taught at, and generate a free personalized tutor!
        </p>

        <div className="mt-8 w-full pb-6">
          <InitialInputArea
            promptValue={promptValue}
            handleInitialChat={handleInitialChat}
            setPromptValue={setPromptValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 lg:flex-nowrap lg:justify-normal pb-8">
          {suggestions.map((item) => (
            <div
              className="flex h-10 cursor-pointer items-center justify-center gap-2 border border-gray-200 px-4 py-2 transition hover:border-gray-900 hover:bg-gray-100 rounded-full bg-gray-50"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <Image
                src={item.icon || "/placeholder.svg"}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px]"
              />
              <span className="text-sm text-gray-700 font-normal">{item.name}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-600">
          Fully open source!{" "}
          <span className="font-medium underline">
            <a className="text-gray-900" href="https://github.com/Nutlope/llamatutor" target="_blank" rel="noopener noreferrer">
              Star it on GitHub
            </a>
          </span>
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6">
        <Image
          src={mobileImg || "/placeholder.svg"}
          alt="hero"
          className="w-full rounded-xl border border-gray-200 lg:hidden"
        />
      </div>
    </>
  )
}

export default Hero
