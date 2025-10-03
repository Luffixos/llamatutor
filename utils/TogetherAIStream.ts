import { createParser, type ParsedEvent, type ReconnectInterval } from "eventsource-parser"

export type ChatGPTAgent = "user" | "system"

export interface ChatGPTMessage {
  role: ChatGPTAgent
  content: string
}

export interface TogetherAIStreamPayload {
  model: string
  messages: ChatGPTMessage[]
  stream: boolean
  max_tokens?: number
  temperature?: number
  top_p?: number
  top_k?: number
  repetition_penalty?: number
}

export async function TogetherAIStream(payload: TogetherAIStreamPayload) {
  const togetherApiKey = process.env.TOGETHER_API_KEY
  const heliconeApiKey = process.env.HELICONE_API_KEY

  if (!togetherApiKey) {
    throw new Error("TOGETHER_API_KEY is not set. Please add it to your environment variables.")
  }

  if (!heliconeApiKey) {
    throw new Error("HELICONE_API_KEY is not set. Please add it to your environment variables.")
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  console.log(
    "[v0] Together AI Request:",
    JSON.stringify({
      model: payload.model,
      messageCount: payload.messages.length,
      stream: payload.stream,
      max_tokens: payload.max_tokens,
    }),
  )

  const res = await fetch("https://together.helicone.ai/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      "Helicone-Auth": `Bearer ${heliconeApiKey}`,
      "Helicone-Property-AppName": "llamatutor",
      Authorization: `Bearer ${togetherApiKey}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (res.status !== 200) {
    const errorBody = await res.text()
    console.log("[v0] Together AI Error Response:", {
      status: res.status,
      statusText: res.statusText,
      body: errorBody,
    })
    throw new Error(`Together AI API error (${res.status}): ${errorBody}`)
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      // callback
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data
          controller.enqueue(encoder.encode(data))
        }
      }

      // optimistic error handling
      if (res.status !== 200) {
        const data = {
          status: res.status,
          statusText: res.statusText,
          body: await res.text(),
        }
        console.log(`Error: received non-200 status code, ${JSON.stringify(data)}`)
        controller.close()
        return
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse)
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  let counter = 0
  const transformStream = new TransformStream({
    async transform(chunk, controller) {
      const data = decoder.decode(chunk)
      // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
      if (data === "[DONE]") {
        controller.terminate()
        return
      }
      try {
        const json = JSON.parse(data)
        const text = json.choices[0].delta?.content || ""
        if (counter < 2 && (text.match(/\n/) || []).length) {
          // this is a prefix character (i.e., "\n\n"), do nothing
          return
        }
        // stream transformed JSON response as SSE
        const payload = { text: text }
        // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#event_stream_format
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`))
        counter++
      } catch (e) {
        // maybe parse error
        controller.error(e)
      }
    },
  })

  return readableStream.pipeThrough(transformStream)
}
