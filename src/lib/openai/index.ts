import { Configuration, OpenAIApi } from "openai-edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_KEY!,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text: string) {
  try {
    const res = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text.replace(/\n/g, " "),
    });
    const result = await res.json();
    if (result.error) {
      throw new Error(result.error.message);
    }
    return result.data[0].embedding as number[];
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export default openai;
