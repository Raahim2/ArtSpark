const generateImage = require('../Models/GenImage');
const uploadImage = require('../Models/UploadOnline');


    
async function generateThumbnail(prompt) {
    console.log("\n\nStep 2/5 - Generating Video Thumbnail");
    const updated_prompt = `A thumbnail for a video with the title: '${prompt}'`;

    const base64Image = await generateImage(updated_prompt);
    const url = await uploadImage(base64Image);
    return url;
}
   

export default generateThumbnail;