import { SHOTSTACK_API_KEY } from '@env';


const getRenderStatus = async (renderId) => {
    // const endpoint = `https://api.shotstack.io/stage/render/${renderId}`; // Replace with the correct status endpoint
    const endpoint = `https://api.shotstack.io/stage/render/${renderId}`;
  
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "x-api-key": `${SHOTSTACK_API_KEY}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Render status result:", result);
  
      // Check if the render is complete
      if (result.response && result.response.status === "done") {
        console.log("Video URL:", result.response.url);
        return result.response.url;
      } else {
        console.log("Render still in progress...");
        return null;
      }
    } catch (error) {
      console.error("Failed to get render status:", error);
      return null;
    }
  };

const concatVideos = async (videoUrls) => {
    const endpoint = "https://api.shotstack.io/stage/render"; // Replace with the correct endpoint
  
    // Prepare the payload for concatenation
    const payload = {
      timeline: {
        tracks: [
          {
            clips: videoUrls.map((url) => ({
              asset: {
                type: "video",
                src: url,
              },
              start: "auto",
              length: "auto",
            })),
          },
        ],
      },
      output: {
        format: "mp4",
        size: {
          width: 1280,
          height: 720,
        },
      },
    };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${SHOTSTACK_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log("Concatenation result:", result);
      const renderId = result.response.id;
      console.log("Render ID:", renderId);
      let videoUrl = await getRenderStatus(renderId);
      console.log("Video URL:", videoUrl);
          
      while (videoUrl === null) {
        videoUrl = await getRenderStatus(renderId);
        console.log("Video URL:", videoUrl);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      return videoUrl;

    } catch (error) {
      console.error("Failed to concatenate videos:", error);
      return null;
    }
  };
  

  
  




export default concatVideos;
