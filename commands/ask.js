const { SlashCommandBuilder } = require("discord.js");


module.exports = {
  name: 'ask',
  description: 'Tanya ke AI (Gemini)',

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString('question');

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: question }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'AI tidak menjawab 😢';

    await interaction.editReply(answer);
  }
};
