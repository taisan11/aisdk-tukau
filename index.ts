import { generateText, streamText,tool } from "ai"
import { valibotSchema } from "@ai-sdk/valibot"
import { google } from "@ai-sdk/google"
import * as v from "valibot"

const testtool = tool({
    description: '指定した土地の天気を取得するツールです。',
    parameters: valibotSchema(v.object({
      location: v.pipe(v.string(),v.description("天気を取得したい都市名")),
    })),
    execute: async ({ location }) => ({
      location,
      temperature: 72 + Math.floor(Math.random() * 21) - 10,
    }),
  })

type StreamTextArgs = Parameters<typeof streamText>[0];

const model = google("gemini-2.0-flash-001")

const settings: StreamTextArgs = { maxSteps:5,model, system: "必ず日本語で返答してください。なるべく正確な返答をしてください。なるべく簡潔に返答してください。現在マークダウンを使用しています。",tools:{weather:testtool},onFinish:({toolResults})=>{console.debug(toolResults)} }
let stream:Boolean = false
while (true) {
    const text = prompt("> ")
    if (text=="/exit"||text=="/quit"||text=="/q") break
    if (text=="/stream") {
        stream = !stream
        continue
    }
    if (!text) continue;
    settings.prompt = text
    if (stream) {
        const nun = streamText(settings)
        for await (const text of nun.textStream) {
            Bun.stdout.write(text)
        }
    } else {
        const nun = await generateText(settings)
        console.log(nun.text)
    }
}