import { generateText, streamText,tool,experimental_generateImage as generateImage,embed } from "ai"
import { valibotSchema } from "@ai-sdk/valibot"
import * as v from "valibot"
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  // baseURL:Bun.env.BaseURL,
  apiKey: Bun.env.GOOGLE_API_KEY,
});

const result = await generateText({
    model: google('gemini-2.0-flash-exp'),
    providerOptions: {
        google: { responseModalities: ['TEXT', 'IMAGE'] },
    },
    prompt: 'cloudflareについての説明画像を作成してください。',
});

for (const file of result.files) {
    if (file.mimeType.startsWith('image/')) {
        Bun.write("image.png", file.uint8Array)
    }
}

console.log(result.text)