const { SlashCommandBuilder } = require("discord.js");
// Import library resmi Google Gemini
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    // 1. Defer reply agar bot tidak timeout (karena AI butuh waktu mikir)
    await interaction.deferReply();

    const question = interaction.options.getString("question");

    try {
      // 2. Cek apakah API Key ada
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("API Key belum diset di .env");
      }

      // 3. Setup Model menggunakan SDK
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      // Gunakan 'gemini-1.5-flash' yang lebih cepat dan hemat
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // 4. Kirim request ke AI
      const result = await model.generateContent(question);
      const response = await result.response;
      const text = response.text();

      // 5. Kirim jawaban ke Discord (Batasi 2000 karakter)
      if (text.length > 2000) {
        await interaction.editReply(text.substring(0, 1990) + "...\n(Jawaban dipotong karena terlalu panjang)");
      } else {
        await interaction.editReply(text);
      }

    } catch (err) {
      console.error("Gemini Error:", err);
      
      // Deteksi error spesifik
      let errorMessage = "❌ Terjadi kesalahan pada AI.";
      
      if (err.message.includes("API Key")) {
        errorMessage = "❌ Konfigurasi API Key salah.";
      } else if (err.message.includes("404") || err.message.includes("Not Found")) {
        // Jika masih 404 pakai SDK, berarti masalahnya di akun Google Cloud
        errorMessage = "❌ Model tidak ditemukan. Cek pengaturan Google Cloud Console kamu.";
      }

      await interaction.editReply(errorMessage);
    }
  }
};