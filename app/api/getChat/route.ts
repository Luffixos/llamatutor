import { TogetherAIStream, type TogetherAIStreamPayload } from "@/utils/TogetherAIStream"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { headers } from "next/headers"

let ratelimit: Ratelimit | undefined

// Add rate limiting if Upstash API keys are set, otherwise skip
if (process.env.KV_REST_API_URL) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    // Allow 10 requests per day
    limiter: Ratelimit.fixedWindow(10, "1440 m"),
    analytics: true,
    prefix: "llamatutor",
  })
}

export async function POST(request: Request) {
  const { messages } = await request.json()

  console.log("[v0] Received chat request with", messages?.length || 0, "messages")

  if (ratelimit) {
    const identifier = getIPAddress()

    const { success } = await ratelimit.limit(identifier)
    if (!success) {
      return Response.json("No requests left. Try again in 24h.", {
        status: 429,
      })
    }
  }

  try {
    const payload: TogetherAIStreamPayload = {
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages,
      stream: true,
      max_tokens: 2048,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
    }

    console.log("[v0] Calling TogetherAIStream with payload")
    const stream = await TogetherAIStream(payload)

    return new Response(stream, {
      headers: new Headers({
        "Cache-Control": "no-cache",
      }),
    })
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Answer stream failed."
    console.error("[v0] Chat API Error:", errorMessage)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

export const runtime = "edge"

function getIPAddress() {
  const FALLBACK_IP_ADDRESS = "0.0.0.0"
  const forwardedFor = headers().get("x-forwarded-for")

  if (forwardedFor) {
    return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS
  }

  return headers().get("x-real-ip") ?? FALLBACK_IP_ADDRESS
}
