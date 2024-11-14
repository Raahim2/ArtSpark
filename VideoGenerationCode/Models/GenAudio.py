import os
import requests
from Models.OnlineUpload import upload_audio_to_cloudinary
import tempfile
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
HUGGING_FACE_API = os.getenv("HUGGING_FACE_API")


def GenerateAudio(text):
    """
    Generates an audio file from text using Hugging Face's TTS model,
    saves it temporarily, and uploads it to Cloudinary.
    """
    # Define Hugging Face TTS model API endpoint and headers
    api_url = "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_API}"}

    # Send POST request to Hugging Face API to generate audio
    response = requests.post(api_url, headers=headers, json={"inputs": text})

    # Check if the response is successful and contains audio data
    if response.status_code == 200 and 'audio' in response.headers.get("Content-Type", ""):
        # Save the audio content to a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as temp_audio:
            temp_audio.write(response.content)
            temp_audio_path = temp_audio.name
        
        

        # Upload to Cloudinary and get the link
        upload_link = upload_audio_to_cloudinary(temp_audio_path)

        # Clean up temporary file
        os.remove(temp_audio_path)

        return upload_link
    else:
        # Print response details for debugging
        print("Failed to generate audio:", response.status_code, response.text)
        raise Exception(f"Failed to generate audio: {response.status_code}, {response.text}")
