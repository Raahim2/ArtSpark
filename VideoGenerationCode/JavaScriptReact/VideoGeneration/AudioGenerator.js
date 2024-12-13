
const genAudio = require('../Models/GenAudio');
const { uploadAudio } = require('../Models/UploadOnline');


    
async function generateAudio(prompt) {
    console.log("\n\nStep 3/5 - Generating Video Audio");
    const audioBuffer = await genAudio(prompt);
    console.log(audioBuffer.slice(0, 10));
    const audioUrl = await uploadAudio(audioBuffer);
    console.log("Audio generated successfully.");
    return audioUrl;
}
   

export default generateAudio;