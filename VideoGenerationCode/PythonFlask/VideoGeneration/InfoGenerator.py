# python -m VideoGeneration.InfoGenerator  
import json
from Models.GenText import Gemini

def GenerateInfo(base_prompt , duration):
  print("\nStep 1/5 - Generating Video Information\n")
  Titleprompt = f"Give me a Video Title for {base_prompt} Output Just The Video Title Nothing Else Video Title Must be less then 10 Words , Only Output One Video Title Also Remove Any Special Characters Symbols or Emojis"
  Title = Gemini(Titleprompt)
  Title = Title.replace('"', '').replace("'", "")

  if(Title==""):
     Title=base_prompt

  Descprompt = f"Give me a Video Description for {base_prompt} Output Just The Video Description Nothing Else Also Remove Any Special Characters Symbols or Emojis"
  Desc = Gemini(Descprompt)
  Desc = Desc.replace('"', '').replace("'", "")


  image_prompt = f"I Want search images and videos with Pexels API for Video Title `{Title}`\nGive me one word to fetch best images on pexels for my video \nOutput only one - two word nothing else Also Remove Any Special Characters Symbols or Emojis"
  OneWord = Gemini(image_prompt)
  OneWord = OneWord.replace('"', '').replace("'", "")


  print(f"Title: {Title}")
  print(f"Description : {Desc} ")
  print(f"OneWord : {OneWord} ")

  data = {
      "Video Title": Title,
      "Video Description": Desc,
      "Video Duration": duration,
      "OneWord":OneWord
  }

  return data

