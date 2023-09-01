
import OpenAI from "openai";
// import { customerSupportAgent } from '~/agents'
import * as agents from '~/agents'

interface EventBody {
  messages: OpenAI.Chat.ChatCompletionMessage[]
  temperature?: number | null
  agent: string | null,
  url?: string | null
}

export default defineEventHandler(async (event) => {
  const { OPENAI_API_KEY } = useRuntimeConfig()

  const body = await readBody<EventBody>(event)
  const agent = body.agent || 'customerSupportAgent'

  if (!Object.keys(agents).includes(agent)) {
    throw new Error(`Agent ${agent} not found`)
  }

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: body.messages || [],
    temperature: body.temperature || 1,
    // ...customerSupportAgent(body) // example only agent

    //@ts-ignore checking abouve if agent exists
    ...agents[agent](body)
  });

  return completion
})
