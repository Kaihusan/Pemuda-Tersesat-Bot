const { SlashCommandBuilder } = require("discord.js");
const Groq = require("groq-sdk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Tanya ke AI Llama 3 (via Groq)")
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
      // Cek API Key
      if (!process.env.GROQ_API_KEY) {
        throw new Error("API Key Groq belum diset di .env");
      }

      // Inisialisasi Groq
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

      // Request ke AI
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        // Model Llama 3 (Cepat & Pintar)
        model: "llama3-8b-8192", 
      });

      // Ambil jawaban
      const answer = chatCompletion.choices[0]?.message?.content || "";

      // Kirim ke Discord (Potong jika > 2000 char)
      if (answer.length > 2000) {
        await interaction.editReply(answer.substring(0, 1990) + "...\n(Dipotong)");
      } else {
        await interaction.editReply(answer);
      }

    } catch (err) {
      console.error("Groq Error:", err);
      await interaction.editReply("❌ Gagal menghubungi AI (Groq Error).");
    }
  }
};