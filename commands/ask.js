const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI Gemini")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Pertanyaan kamu")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const question = interaction.options.getString("question");

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Kamu adalah AI Discord yang ramah dan membantu.\n\n${question}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const answer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

      await interaction.editReply(
        answer || "⚠️ AI tidak memberi jawaban"
      );

    } catch (error) {
      console.error(error);
      await interaction.editReply("❌ Terjadi error saat menghubungi AI");
    }
  }
};
