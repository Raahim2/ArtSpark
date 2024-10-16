# python -m VideoGeneration.InfoGenerator  
import json
from Models.GenText import MistralChatBot

def GenerateInfo(base_prompt , duration , file_path="VideoGenerationCode/Outputs/data.json"):
  print("\nStep 1/5 - Generating Video Information\n")
  Titleprompt = f"Give me a Video Title for {base_prompt} Output Just The Video Title Nothing Else Video Title Must be less then 10 Words"
  Title = MistralChatBot(Titleprompt)
  Title = Title.replace(Titleprompt,"")
  if(Title==""):
     Title=base_prompt

  Descprompt = f"Give me a Video Description for {base_prompt} Output Just The Video Description Nothing Else "
  Desc = MistralChatBot(Descprompt)
  Desc = Desc.replace(Descprompt,"")

  image_prompt = f"I Want search images and videos with Pexels API for Video Title `{Title}`\nGive me one word to fetch best images on pexels for my video \nOutput only one - two word nothing else"
  OneWord = MistralChatBot(image_prompt)
  OneWord = OneWord.replace(image_prompt, "").strip()

  print(f"Title: {Title}")
  print(f"Description : {Desc} ")
  print(f"OneWord : {OneWord} ")

  data = {
      "Video Title": Title,
      "Video Description": Desc,
      "Video Duration": duration,
      "OneWord":OneWord
  }

  with open(file_path, 'w') as json_file:
      json.dump(data, json_file, indent=4)

