
const genAudio = async (text) => {
  console.log("Generating audio...");
  const apiUrl = "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech";
  const headers = {
    "Authorization": `Bearer ${process.env.HUGGING_FACE_API}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API Error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = new Uint8Array(arrayBuffer);

    return audioBuffer;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
};

module.exports = genAudio;
