import os
import requests

def MistralChatBot(prompt):
    api_url = "https://api-inference.huggingface.co/models/mistralai/mistral"
    headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}

    response = requests.post(api_url, headers=headers, json={"inputs": prompt})

    if response.status_code == 200:
        message = response.json()[0]['generated_text'].strip()
        return message
    else:
        raise Exception(f"Failed to get response from Mistral AI: {response.status_code}, {response.text}")

