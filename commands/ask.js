const { SlashCommandBuilder } = require("discord.js");
const Groq = require("groq-sdk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI Llama 3.1 (via Groq)")
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
      if (!process.env.GROQ_API_KEY) {
        throw new Error("API Key Groq belum diset di .env");
      }

      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        // UPDATE: Menggunakan model Llama 3.1 yang aktif saat ini
        model: "llama-3.1-8b-instant", 
      });

      const answer = chatCompletion.choices[0]?.message?.content || "";

      if (answer.length > 2000) {
        await interaction.editReply(answer.substring(0, 1990) + "...\n(Dipotong karena limit Discord)");
      } else {
        await interaction.editReply(answer);
      }

    } catch (err) {
      console.error("Groq Error:", err);
      // Tampilkan pesan error yang lebih jelas ke Discord (opsional, untuk debugging)
      let msg = "❌ Gagal menghubungi AI.";
      if (err.message.includes("401")) msg = "❌ API Key Groq salah.";
      if (err.message.includes("404") || err.message.includes("400")) msg = "❌ Model AI sedang gangguan/ganti versi.";
      
      await interaction.editReply(msg);
    }
  }
};