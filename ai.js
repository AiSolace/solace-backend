const OpenAI = require("openai");
const { systemPrompt } = require("../config/prompts");

let client = null;

if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

async function askAI(question, context = "") {
  try {
    if (!client) return null;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `
Context:
${context}

User question:
${question}
          `
        }
      ]
    });

    return completion.choices[0]?.message?.content || null;

  } catch (err) {
    console.log("AI error:", err.message);
    return null;
  }
}

module.exports = { askAI };