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

async function getPexelsImages(query, num_image, target_aspect_ratio = 16 / 9, tolerance = 0.1) {
  console.log("getting pexels image");
  const endpoint = 'https://api.pexels.com/v1/search';

  const headers = {
    'Authorization': process.env.PEXELS_API_KEY,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  };

  const url = new URL(endpoint);
  url.search = new URLSearchParams({
    'query': query,
    'per_page': num_image
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (response.status === 200) {
      const data = await response.json();
      const photos = data.photos || [];

      if (photos.length > 0) {
        const image_urls = [];
        for (const photo of photos) {
          const width = photo.width;
          const height = photo.height;

          if (width && height) {
            const aspect_ratio = width / height;
            if (Math.abs(aspect_ratio - target_aspect_ratio) < tolerance) {
              image_urls.push(photo.src.original);
            }
          }
        }

        if (image_urls.length > 0) {
          return image_urls;
        } else {
          console.log("No images with the specified aspect ratio found.");
          return [];
        }
      } else {
        console.log("No images found.");
        return [];
      }
    } else {
      console.log(`Failed to retrieve images. Status code: ${response.status}`);
      return [];
    }
  } catch (error) {
    console.error("Error retrieving images:", error);
    return [];
  }
}


module.exports = getPexelsImages;





