import Groq from "groq-sdk";

const groq = new Groq({ apiKey: "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" });

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
