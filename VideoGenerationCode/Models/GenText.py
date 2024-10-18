import os
import requests
from dotenv import load_dotenv

load_dotenv()

HUGGING_FACE_API = os.getenv("HUGGING_FACE_API")

def MistralChatBot(prompt):
    api_url = "https://api-inference.huggingface.co/models/mistralai/Mistral-Small-Instruct-2409"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API}"}
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 500,
            "return_full_text": False
        }
    }

    response = requests.post(api_url, headers=headers, json=payload)

    if response.status_code == 200:
        result = response.json()
        output_message = "".join([message['generated_text'] for message in result])
        return output_message
    else:
        raise Exception(f"Failed to generate text: {response.status_code}, {response.text}")

