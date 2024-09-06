import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getRandomCity() {
  const chatCompletion = await getGroqChatCompletion();
  return (chatCompletion.choices[0]?.message?.content || "").replaceAll("*", "");
}

async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "return only one word and that is a random city name",
      },
    ],
    model: "llama3-8b-8192",
  });
}
