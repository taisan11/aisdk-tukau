import { generateText, streamText,tool,embed } from "ai"
import { valibotSchema } from "@ai-sdk/valibot"
import * as v from "valibot"
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { PGlite } from "@electric-sql/pglite";
import { vector } from "@electric-sql/pglite/vector";

// const pglite = new PGlite({
//   extensions: { vector },
//   dataDir: "./data"
// });

const google = createGoogleGenerativeAI({
  // baseURL:Bun.env.BaseURL,
  apiKey: Bun.env.GOOGLE_API_KEY,
});

async function generateEmbedding(value: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-multilingual-embedding-002"),
    value,
  });
  return embedding;
}

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

const settings: StreamTextArgs = { maxSteps:5,model, system: "必ず日本語で返答してください。なるべく正確な返答をしてください。なるべく簡潔に返答してください。現在マークダウンを使用しています。",}
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