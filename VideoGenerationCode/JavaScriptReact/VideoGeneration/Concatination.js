// import {   downloadVideo, normalizeVideo, concatVideos } from '../Models/Concat';

// async function ConcatVideos(videoUrls, outputFileName) {
//     console.log("Concatenating videos...");
//     let inputPaths = [];
//     for (let i = 0; i < videoUrls.length; i++) {
//         const downloadedVideoPath = await downloadVideo(videoUrls[i], `video${i+1}.mp4`);
//         inputPaths.push(downloadedVideoPath);
//         console.log(`Downloaded video ${i+1} of ${videoUrls.length}`);
//     }

//     console.log(inputPaths);

//     // const normalizedPaths = inputPaths.map((path, index) => `/assets/Videos/normalized${index+1}.mp4`);

//     // let index = 0;
//     // function normalizeNext() {
//     //   if (index < inputPaths.length) {
//     //     normalizeVideo(inputPaths[index], normalizedPaths[index], (err) => {
//     //       if (err) {
//     //         console.error(`Failed to normalize video: ${inputPaths[index]}`);
//     //         return;
//     //       }
//     //       index++;
//     //       normalizeNext();
//     //     });
//     //   } else {
//     //     // All videos normalized, proceed to concatenation
//     //     console.log("All videos normalized, proceeding to concatenation");
//     //     concatVideos(normalizedPaths, outputFileName);
//     //   }
//     // }
  
//     // normalizeNext();
// }


import { downloadVideo, normalizeVideo, concatVideos } from '../Models/Concat';

async function ConcatVideos(videoUrls, outputFileName) {
    console.log("Concatenating videos...");
    let inputPaths = [];
    for (let i = 0; i < videoUrls.length; i++) {
        const downloadedVideoPath = await downloadVideo(videoUrls[i], `${RNFS.DocumentDirectoryPath}/video${i+1}.mp4`);
        inputPaths.push(downloadedVideoPath);
        console.log(`Downloaded video ${i+1} of ${videoUrls.length}`);
    }

    console.log(inputPaths);

    const normalizedPaths = inputPaths.map((path, index) => `${RNFS.DocumentDirectoryPath}/normalized${index+1}.mp4`);

    let index = 0;
    async function normalizeNext() {
        if (index < inputPaths.length) {
            await normalizeVideo(inputPaths[index], normalizedPaths[index]);
            index++;
            normalizeNext();
        } else {
            // All videos normalized, proceed to concatenation
            console.log("All videos normalized, proceeding to concatenation");
            await concatVideos(normalizedPaths, outputFileName);
        }
    }

    normalizeNext();
}




export default ConcatVideos;
