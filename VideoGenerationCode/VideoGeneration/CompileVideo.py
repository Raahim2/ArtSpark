import os
import requests
from moviepy.editor import VideoFileClip, concatenate_videoclips
from Models.OnlineUpload import upload_video_to_cloudinary
import tempfile

def download_video(url):
    """Download video from URL to a temporary file in /tmp."""
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4', dir='/tmp')
    response = requests.get(url, stream=True)
    with open(temp_file.name, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
    return temp_file.name

def concatenate_videos(video_urls):
    """Concatenate videos and upload to Cloudinary."""
    temp_files = []
    clips = []
    
    try:
        # Download each video to temp file and prepare for concatenation
        for url in video_urls:
            temp_file = download_video(url)
            temp_files.append(temp_file)
            clip = VideoFileClip(temp_file)
            clips.append(clip)
        
        # Create temporary output file in /tmp
        output_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4', dir='/tmp')
        
        # Concatenate all video clips
        final_clip = concatenate_videoclips(clips, method="compose")
        final_clip.write_videofile(output_file.name)
        
        # Close clips before uploading to avoid file lock
        for clip in clips:
            clip.close()
        final_clip.close()
            
        # Upload to Cloudinary
        cloudinary_url = upload_video_to_cloudinary(output_file.name)
        return cloudinary_url

    finally:
        # Clean up - remove temp files
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
            except Exception as e:
                print(f"Error removing temp file: {e}")
                
        if 'output_file' in locals():
            try:
                if os.path.exists(output_file.name):
                    os.remove(output_file.name)
            except Exception as e:
                print(f"Error removing output file: {e}")

def process_videos(video_urls):
    """Main function to process videos and return Cloudinary URL."""
    try:
        cloudinary_url = concatenate_videos(video_urls)
        if cloudinary_url:
            return {"success": True, "url": cloudinary_url}
        else:
            return {"success": False, "error": "Failed to upload to Cloudinary"}
    except Exception as e:
        return {"success": False, "error": str(e)}
