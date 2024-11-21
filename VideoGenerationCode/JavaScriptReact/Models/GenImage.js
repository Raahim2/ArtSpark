import { HUGGING_FACE_API } from '@env';

async function generateImage(prompt) {
  console.log("Generating Image...");
  const API_URL = "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora";
  const API_KEY = `Bearer ${HUGGING_FACE_API}`; 

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    });

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}: ${response.statusText}`);
    }

    // Read the response as a binary array
    const arrayBuffer = await response.arrayBuffer();
    // Convert binary data to Base64
    const base64Data = btoa(
      new Uint8Array(arrayBuffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    console.log("Base64 Data:", base64Data.slice(0, 50) + "...");

    return `${base64Data}`;

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

module.exports = generateImage;




