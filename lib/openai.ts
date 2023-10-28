import { Configuration, OpenAIApi } from "openai-edge";

console.log(process.env.OPENAI_API_KEY);
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);
console.log({ openai });

export async function generateImagePropmt(name: string) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a creative and helpful AI assistant capable of generating interesting thumbnail descriptions for my notes. Output will be fed into the DALLE API to generate a thumbnail. The description should be minimalistic flat styled.",
        },
        {
          role: "user",
          content: `Please generate thumbnail description for my note title ${name}`,
        },
      ],
    });
    const data = await response.json();
    console.log("result", data.choices[0].message);
    const image_description = data.choices[0].message.content;
    return image_description as string;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await openai.createImage({
      prompt,
      n: 1,
      size: "256x256",
    });
    const data = await response.json();
    const image_url = data.data[0].url;
    return image_url as string;
  } catch (error) {
    console.error(error);
  }
}
