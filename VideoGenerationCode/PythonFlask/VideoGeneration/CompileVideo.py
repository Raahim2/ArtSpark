import os
import requests
from moviepy.editor import VideoFileClip, concatenate_videoclips
from Models.OnlineUpload import upload_video_to_cloudinary
import tempfile

def download_video(url):
    """Download video from URL to a temporary file in the system's temp directory."""
    print(f"Starting download for video: {url}")
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4' ,)
    response = requests.get(url, stream=True)
    with open(temp_file.name, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
    print(f"Video downloaded to temporary file: {temp_file.name}")
    return temp_file.name



def concatenate_videos2(video_urls):
    """Concatenate videos and upload to Cloudinary."""
    print("Starting video concatenation process.")
    temp_files = []
    clips = []
    
    try:
        # Download each video to temp file and prepare for concatenation
        for url in video_urls:
            print(f"Processing video URL: {url}")
            temp_file = download_video(url)
            temp_files.append(temp_file)
            clip = VideoFileClip(temp_file).without_audio()
            clips.append(clip)
            print(f"Downloaded and loaded clip: {clip}")
        
        # Create temporary output file in the system's temp directory
        output_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        print(f"Created output file: {output_file.name}")
        
        # Concatenate all video clips
        print("Concatenating video clips.")
        final_clip = concatenate_videoclips(clips, method="compose")
        final_clip.write_videofile(output_file.name, codec='libx264' , audio=False)
        print(f"Final clip written to: {output_file.name}")
        
        # Close clips before uploading to avoid file lock
        for clip in clips:
            clip.close()
        final_clip.close()
            
        # Upload to Cloudinary
        print("Uploading final video to Cloudinary.")
        cloudinary_url = upload_video_to_cloudinary(output_file.name)
        print(f"Uploaded to Cloudinary: {cloudinary_url}")
        return cloudinary_url

    finally:
        # Clean up - remove temp files
        print("Done ")
        # for temp_file in temp_files:
        #     try:
        #         if os.path.exists(temp_file):
        #             os.remove(temp_file)
        #             print(f"Removed temporary file: {temp_file}")
        #     except Exception as e:
        #         print(f"Error removing temp file: {e}")
                
        # if 'output_file' in locals():
        #     try:
        #         if os.path.exists(output_file.name):
        #             os.remove(output_file.name)
        #             print(f"Removed output file: {output_file.name}")
        #     except Exception as e:
        #         print(f"Error removing output file: {e}")




def concatenate_videos(temp_files):
    """Concatenate videos and upload to Cloudinary."""
    print("Starting video concatenation process.")
    clips = []
    
    try:
        # Download each video to temp file and prepare for concatenation
        for temp_file in temp_files:
            print(f"Processing video URL: {temp_file}")
            clip = VideoFileClip(temp_file).without_audio()
            clips.append(clip)
            print(f"Downloaded and loaded clip: {clip}")
        
        # Create temporary output file in the system's temp directory
        output_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        print(f"Created output file: {output_file.name}")
        
        # Concatenate all video clips
        print("Concatenating video clips.")
        final_clip = concatenate_videoclips(clips, method="compose")
        final_clip.write_videofile(output_file.name, codec='libx264' , audio=False)
        print(f"Final clip written to: {output_file.name}")
        
        # Close clips before uploading to avoid file lock
        for clip in clips:
            clip.close()
        final_clip.close()
            
        # Upload to Cloudinary
        print("Uploading final video to Cloudinary.")
        cloudinary_url = upload_video_to_cloudinary(output_file.name)
        print(f"Uploaded to Cloudinary: {cloudinary_url}")
        return cloudinary_url

    finally:
        # Clean up - remove temp files
        print("Cleaning up temp files.")
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.remove(temp_file)
                    print(f"Removed temporary file: {temp_file}")
            except Exception as e:
                print(f"Error removing temp file: {e}")
                
        if 'output_file' in locals():
            try:
                if os.path.exists(output_file.name):
                    os.remove(output_file.name)
                    print(f"Removed output file: {output_file.name}")
            except Exception as e:
                print(f"Error removing output file: {e}")





def process_videos(video_urls):
    """Main function to process videos and return Cloudinary URL."""
    print("Starting video processing.")
    try:
        cloudinary_url = concatenate_videos(video_urls)
        if cloudinary_url:
            print("Video processing successful.")
            return {"success": True, "url": cloudinary_url}
        else:
            print("Video processing failed: Failed to upload to Cloudinary.")
            return {"success": False, "error": "Failed to upload to Cloudinary"}
    except Exception as e:
        print(f"An error occurred during video processing: {e}")
        return {"success": False, "error": str(e)}



