

import { RNFFmpeg } from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';


async function downloadVideo(url, filePath) {
  try {
    // Create directories if they don't exist
    const directory = filePath.substring(0, filePath.lastIndexOf('/'));
    if (!(await RNFS.exists(directory))) {
      await RNFS.mkdir(directory);
    }

    console.log(`Starting download from ${url} to ${filePath}`);

    // Download the file
    const options = {
      fromUrl: url,
      toFile: filePath,
      begin: (res) => {
        console.log('Download started:', res);
        console.log(`File size: ${(res.contentLength / (1024 * 1024)).toFixed(2)} MB`);
      },
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
      },
    };

    await RNFS.downloadFile(options).promise;
    console.log(`Finished downloading to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error('Error downloading video:', error);
    throw error;
  }
}


const normalizeVideo = async (inputPath, outputPath) => {
  console.log('Normalizing video:', inputPath);

  const ffmpegCommand = [
    `-i ${inputPath}`,          // Input file
    '-c:v libx264',             // Encode video to H.264
    '-vf scale=1920:1080',      // Resize to 1920x1080
    '-r 30',                    // Set frame rate to 30 fps
    '-an',                      // Remove audio
    outputPath                  // Output file
  ].join(' ');

  try {
    const { rc } = await RNFFmpeg.execute(ffmpegCommand);
    if (rc === 0) {
      console.log(`Normalized video saved to ${outputPath}`);
    } else {
      console.error('Failed to normalize video:', rc);
    }
  } catch (err) {
    console.error('Error normalizing video:', err.message);
  }
};


const concatVideos = async (videoPaths, outputFileName) => {
  try {
    console.log('Preparing to concatenate videos...');
    
    // Create the file list for FFmpeg
    const concatFilePath = `${RNFS.DocumentDirectoryPath}/concat_list.txt`;
    const fileContent = videoPaths.map(path => `file '${path}'`).join('\n');
    await RNFS.writeFile(concatFilePath, fileContent, 'utf8');
    console.log('Concat list file created:', concatFilePath);

    // Define the output file path
    const outputFilePath = `${RNFS.DocumentDirectoryPath}/${outputFileName}`;

    // FFmpeg command
    const ffmpegCommand = [
      `-f concat`,
      `-safe 0`,
      `-i ${concatFilePath}`,
      `-c:v libx264`,
      `-preset fast`,
      `-crf 23`,
      `-an`,                  // Remove audio
      outputFilePath
    ].join(' ');

    // Execute the FFmpeg command
    const { rc } = await RNFFmpeg.execute(ffmpegCommand);
    if (rc === 0) {
      console.log('Concatenation finished successfully:', outputFilePath);
    } else {
      console.error('Concatenation failed with return code:', rc);
    }

    // Cleanup temporary file
    await RNFS.unlink(concatFilePath);
  } catch (err) {
    console.error('Error during video concatenation:', err.message);
  }
};




export { downloadVideo, normalizeVideo, concatVideos };
    
