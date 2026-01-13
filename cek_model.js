require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ API Key tidak ditemukan di .env");
    return;
  }

  console.log("🔍 Sedang menghubungi Google...");

  try {
    // Kita tembak langsung ke endpoint List Models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Error dari Google:", JSON.stringify(data.error, null, 2));
    } else if (data.models) {
      console.log("✅ SUKSES! Berikut model yang tersedia untukmu:");
      console.log("------------------------------------------------");
      data.models.forEach(m => {
        // Hanya tampilkan model yang support generateContent
        if (m.supportedGenerationMethods.includes("generateContent")) {
            console.log(`- Nama Model: ${m.name.replace("models/", "")}`);
        }
      });
      console.log("------------------------------------------------");
      console.log("Gunakan salah satu nama di atas ke dalam code 'ask.js' kamu.");
    } else {
      console.log("⚠️ Tidak ada error, tapi list model kosong. Akun Google Cloud mungkin bermasalah.");
    }

  } catch (err) {
    console.error("❌ Gagal connect:", err);
  }
}

checkModels();