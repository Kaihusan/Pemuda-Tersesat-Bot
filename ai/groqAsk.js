const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function askGroq(question) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: question }
    ],
  });

  return completion.choices[0]?.message?.content || "⚠️ AI tidak menjawab";
}

module.exports = askGroq;
