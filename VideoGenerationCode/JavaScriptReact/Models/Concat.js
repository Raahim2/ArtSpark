import { SHOTSTACK_API_KEY } from '@env';
const { uploadVideo } = require('../Models/UploadOnline');

function getRandomAudio() {
  const audioUrls = [
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3",
    "https://www.bensound.com/bensound-music/bensound-epic.mp3", // Bensound Epic
    "https://www.bensound.com/bensound-music/bensound-ukulele.mp3", // Bensound Ukulele
    "https://www.bensound.com/bensound-music/bensound-jazzcomedy.mp3", // Bensound Jazz Comedy
    "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3" // Bensound Creative Minds
  ];
  const randomIndex = Math.floor(Math.random() * audioUrls.length);
  return audioUrls[randomIndex];
}

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
  
      // Check if the render is complete
      if (result.response && result.response.status === "done") {
        console.log("Video URL:", result.response.url);
        return result.response.url;
      } else {
        console.log("Render status : " + result.response.status);
        return null;
      }
    } catch (error) {
      console.error("Failed to get render status:", error);
      return null;
    }
  };

const concatVideos = async (videoUrls) => {
    const endpoint = "https://api.shotstack.io/stage/render"; // Replace with the correct endpoint
    audioUrl = getRandomAudio()
    console.log("Concatinating Video and adding audio form url "+ audioUrl)
  
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
          {
            "clips": [
              {
                "asset": {
                  "type": "audio",
                  "src": audioUrl,
                  "effect": "fadeOut",
                  "volume": 1
                },
                "start": 0,
                "length": "end"
              }
            ]
          }
          
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
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      let cloudinaryurl;
      try {
        cloudinaryurl = await uploadVideo(videoUrl);
      } catch (error) {
        cloudinaryurl = videoUrl;
      }
      return cloudinaryurl;

    } catch (error) {
      console.error("Failed to concatenate videos:", error);
      return null;
    }
  };



  

  
  




export default concatVideos;
