import os
import requests
from dotenv import load_dotenv

load_dotenv()

HUGGING_FACE_API = os.getenv("HUGGING_FACE_API")

def TextToSpeech(text, audio_path):
    api_url = "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API}"}

    response = requests.post(api_url, headers=headers, json={"inputs": text})

    if response.status_code == 200:
        with open(audio_path, 'wb') as f:
            f.write(response.content)  
    else:
        raise Exception(f"Failed to generate audio: {response.status_code}, {response.text}")

