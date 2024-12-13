

const Gemini = require('../Models/GenText');

async function generateInfo(basePrompt, duration) {
  console.log("\nStep 1/5 - Generating Video Information\n");
  
  const titlePrompt = `Give me a Video Title for ${basePrompt} Output Just The Video Title Nothing Else Video Title Must be less then 10 Words , Only Output One Video Title Also Remove Any Special Characters Symbols or Emojis`;
  let title = await Gemini(titlePrompt);
  title = title.replace(/["']/g, "");

  if (title === "") {
    title = basePrompt;
  }

  const descPrompt = `Give me a Video Description for ${basePrompt} Output Just The Video Description Nothing Else Also Remove Any Special Characters Symbols or Emojis`;
  let desc = await Gemini(descPrompt);
  desc = desc.replace(/["']/g, "");

  const imagePrompt = `I want to search for images and videos using the Pexels API for the video titled \`${title}\`. Please generate **one single word** that best represents the core subject of the video. The word should be broad enough to find relevant content but specific enough to focus on the main theme. Output only one word, nothing else.`;
  let oneWord = await Gemini(imagePrompt);
  oneWord = oneWord.replace(/["']/g, "");

  const scriptPrompt = `Generate a video script for the video titled "${title}". The script should be in paragraph format And Exactly of ${duration*3} Words , Please dont add any Special Charecters in the script`;
  let Script = await Gemini(scriptPrompt);
  Script = Script.replace(/["']/g, "");



  console.log(`Title: ${title}`);
  console.log(`Description: ${desc}`);
  console.log(`OneWord: ${oneWord}`);
  console.log(`Script: ${Script}`);

  const data = {
    "Video Title": title,
    "Video Description": desc,
    "Video Duration": duration,
    "OneWord": oneWord,
    "Video Script": Script
  };

  return data;
}


export default generateInfo;