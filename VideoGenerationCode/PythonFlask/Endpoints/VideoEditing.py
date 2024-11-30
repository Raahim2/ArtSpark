import logging
import ffmpeg
import os
import requests
from flask import request, jsonify, Blueprint
import threading
from Models.OnlineUpload import upload_video_to_cloudinary  
import certifi

logging.basicConfig(level=logging.INFO)

VideoEditing = Blueprint('VideoEditing', __name__)

TEMP_DIR = "/tmp/videos"
job_results = {}

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

def download_video(url, filename):
    try:
        logging.info(f"Downloading video from {url} to {filename}")
        # Use certifi for SSL verification to ensure robust handling of SSL certificates
        response = requests.get(url, stream=True, timeout=30, verify=certifi.where())
        response.raise_for_status()  # Check for HTTP errors
        
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        logging.info(f"Downloaded video saved to {filename}")
    except requests.exceptions.SSLError as ssl_error:
        logging.error(f"SSL error while downloading video from {url}: {ssl_error}")
        raise
    except requests.exceptions.RequestException as req_error:
        logging.error(f"Request error while downloading video from {url}: {req_error}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error while downloading video from {url}: {e}")
        raise


def concatenate_videos(video_paths, output_path):
    try:
        logging.info(f"Starting to concatenate {len(video_paths)} videos without audio.")
        
        if len(video_paths) < 2:
            raise ValueError("At least two videos are required for concatenation.")
        
        # Preprocess videos to remove audio and standardize resolution
        temp_video_files = []
        target_resolution = "1920x1080"  # Target resolution for videos

        for idx, video_path in enumerate(video_paths):
            temp_video = os.path.join(TEMP_DIR, f"temp_video{idx + 1}.mp4")
            ffmpeg.input(video_path).output(
                temp_video,
                vf=f"scale={target_resolution}",
                vcodec="libx264",
                an=None,  # Remove audio
                y=None  # Force overwrite without prompt
            ).run()
            temp_video_files.append(temp_video)

        # Concatenate the processed videos
        inputs = [ffmpeg.input(video) for video in temp_video_files]
        ffmpeg.concat(*inputs, v=1, a=0).output(output_path).run()

        logging.info(f"Concatenation completed successfully, saved to {output_path}.")
    except Exception as e:
        logging.error(f"Error concatenating videos: {e}")
        raise


def process_video(video_urls, job_id):
    result_file = {}
    try:
        logging.info(f"Job {job_id} - Starting to download videos.")
        video_filenames = []

        # Download all videos
        for idx, video_url in enumerate(video_urls):
            video_filename = os.path.join(TEMP_DIR, f"video{idx + 1}_{job_id}.mp4")
            download_video(video_url, video_filename)
            video_filenames.append(video_filename)

        logging.info(f"Job {job_id} - Videos downloaded successfully.")
        output_filename = os.path.join(TEMP_DIR, f"output_{job_id}.mp4")
        
        # Concatenate the videos
        concatenate_videos(video_filenames, output_filename)
        logging.info(f"Job {job_id} - Videos concatenated successfully.")

        # Upload the concatenated video to Cloudinary
        video_url = upload_video_to_cloudinary(output_filename)
        result_file['output_path'] = video_url  # Store the Cloudinary URL
        job_results[job_id] = result_file

        logging.info(f"Job {job_id} - Video uploaded to Cloudinary: {video_url}")
    except Exception as e:
        result_file['error'] = str(e)
        job_results[job_id] = result_file
        logging.error(f"Job {job_id} - Error: {e}")


@VideoEditing.route('/concat_videos', methods=['POST'])
def concat_videos():
    try:
        data = request.json
        video_urls = data['video_urls']  # Expecting a list of video URLs
        if len(video_urls) < 2:
            return jsonify({"error": "At least two videos are required for concatenation."}), 400
        
        job_id = str(os.urandom(6).hex())
        threading.Thread(target=process_video, args=(video_urls, job_id)).start()
        return jsonify({"message": "Video concatenation started.", "job_id": job_id}), 202
    except Exception as e:
        logging.error(f"Error in /concat_videos endpoint: {e}")
        return jsonify({"error": "An error occurred while starting video concatenation."}), 500


@VideoEditing.route('/get_video', methods=['GET'])
def get_video():
    try:
        job_id = request.args.get('job_id')
        if job_id in job_results:
            result = job_results[job_id]
            if 'error' in result:
                return jsonify({"error": result['error']}), 500
            return jsonify({"output_path": result['output_path']}), 200
        else:
            return jsonify({"error": "Job not found or not yet completed."}), 404
    except Exception as e:
        logging.error(f"Error in /get_video endpoint: {e}")
        return jsonify({"error": "An error occurred while retrieving the video."}), 500
