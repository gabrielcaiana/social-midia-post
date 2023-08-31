
import OpenAI from "openai";

interface EventBody {
  messages: OpenAI.Chat.ChatCompletionMessage[]
  temperature?: number | null
}

export default defineEventHandler(async (event) => {
  const { OPENAI_API_KEY } = useRuntimeConfig()

  const body = await readBody<EventBody>(event)

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: body.messages || [],
    temperature: body.temperature || 1,
  });

  return completion.choices[0]
})
