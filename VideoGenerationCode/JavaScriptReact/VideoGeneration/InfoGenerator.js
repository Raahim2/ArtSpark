

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

  const imagePrompt = `I Want search images and videos with Pexels API for Video Title \`${title}\`\nGive me one word to fetch best images on pexels for my video \nOutput only one - two word nothing else Also Remove Any Special Characters Symbols or Emojis`;
  let oneWord = await Gemini(imagePrompt);
  oneWord = oneWord.replace(/["']/g, "");

  console.log(`Title: ${title}`);
  console.log(`Description: ${desc}`);
  console.log(`OneWord: ${oneWord}`);

  const data = {
    "Video Title": title,
    "Video Description": desc,
    "Video Duration": duration,
    "OneWord": oneWord
  };

  return data;
}


export default generateInfo;