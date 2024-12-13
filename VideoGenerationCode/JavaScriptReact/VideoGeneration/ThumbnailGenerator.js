// const generateImage = require('../Models/GenImage');
const getPexelsImages = require('../Models/GenImage');
// const uploadImage = require('../Models/UploadOnline');


    
async function generateThumbnail(oneword) {
    console.log("\n\nStep 2/5 - Generating Video Thumbnail");
    // const updated_prompt = `A thumbnail for a video with the title: '${prompt}'`;

    // const base64Image = await generateImage(updated_prompt);
    // const url = await uploadImage(base64Image);
    const urls = await getPexelsImages(oneword, 20, 16/9, 0.7);
    const randomIndex = Math.floor(Math.random() * urls.length);
    const url = urls[randomIndex];
    

    return url;
}
   

export default generateThumbnail;


