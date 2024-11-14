import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
import cloudinary.api

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

def upload_video_to_cloudinary(video_path):
    """
    Uploads a video file to Cloudinary.

    Parameters:
        video_path (str): The path to the video file to be uploaded.

    Returns:
        str: A link to the uploaded video if successful, otherwise an error message.
    """
    try:
        

        response = cloudinary.uploader.upload(video_path, resource_type="video")
        video_url = response.get("url")
        print(f"Uploaded video link: {video_url}")
        return video_url
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def upload_audio_to_cloudinary(audio_path):
    """
    Uploads the given audio file to Cloudinary.
    """
    try:
        # Upload audio to Cloudinary with resource_type set to "auto" and format set to "mp3"
        response = cloudinary.uploader.upload(
            audio_path,
            resource_type="raw",  # Let Cloudinary auto-detect the file type
            format="mp3"  # Force format to mp3
        )
        return response.get("url")
    except Exception as e:
        print("An error occurred during Cloudinary upload:", e)
        return None

