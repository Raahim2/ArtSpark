import ffmpeg
import os
import tempfile
import requests

def compress_video_to_target_size(url, target_size_mb=10):
    """
    Compresses a video from a URL to ensure it is under the specified target size in MB.

    Parameters:
        url (str): The URL of the video to be compressed.
        target_size_mb (int): The target size in megabytes. Default is 10 MB.

    Returns:
        tempfile.NamedTemporaryFile: The compressed video file if successful, None otherwise.
    """
    try:
        # Download the video from the URL
        response = requests.get(url, stream=True)
        response.raise_for_status()

        input_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4').name
        with open(input_file, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)

        # Get the initial file size in bytes
        initial_size = os.path.getsize(input_file)
        target_size_bytes = target_size_mb * 1024 * 1024

        # Calculate the initial bitrate
        probe = ffmpeg.probe(input_file)
        duration = float(probe['format']['duration'])
        initial_bitrate = (initial_size * 8) / duration

        # Calculate the target bitrate
        target_bitrate = (target_size_bytes * 8) / duration

        # Generate a temporary output file path
        output_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4').name

        # Compress the video
        ffmpeg.input(input_file).output(output_file, video_bitrate=target_bitrate, audio_bitrate='128k').run(overwrite_output=True)

        # Check the output file size
        final_size = os.path.getsize(output_file)
        if final_size <= target_size_bytes:
            print(f"Compression successful: {output_file} is under {target_size_mb} MB.")
            return output_file
        else:
            print(f"Compression failed: {output_file} is over {target_size_mb} MB. Trying again...")
            return compress_video_to_target_size(output_file, target_size_mb)

    except Exception as e:
        print(f"An error occurred during compression: {e}")
        return None
