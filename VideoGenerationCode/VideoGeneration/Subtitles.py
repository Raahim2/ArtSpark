# python -m VideoGeneration.Subtitles
from Models.OnlineUpload import upload_video_to_cloudinary
from Models.GenText import Gemini
from Models.GenAudio import GenerateAudio   
import ffmpeg
import math
import tempfile
import requests
import os

def create_typing_effect_tempfile(input_url, video_script, font_size=46, font_color='white'):
    try:
        probe_info = ffmpeg.probe(input_url)
        video_duration = float(probe_info['streams'][0]['duration'])
    except KeyError as e:
        print(f"Error extracting duration information from video file: {e}")
        return None
    
    except FileNotFoundError:
        print("Error: Input video file not found. Please check the file path.")
        return None

    # Split text into words
    words = video_script.split()
    total_words = len(words)

    # Calculate how long each set of 8 words should be displayed based on video duration
    words_per_display = 8
    total_segments = (total_words + words_per_display - 1) // words_per_display  # Ceiling division

    duration_per_segment = video_duration / total_segments

    drawtext_filters = []
    
    for segment in range(total_segments):
        start_index = segment * words_per_display
        end_index = min(start_index + words_per_display, total_words)
        
        # Join the current segment of words
        current_words = ' '.join(words[start_index:end_index])
        
        drawtext_filters.append(
            f"drawtext=text='{current_words}':x=(w-text_w)/2:y=h-th-10:fontsize={font_size}:fontcolor={font_color}:"
            f"box=1:boxcolor=black@0.75:boxborderw=10:"
            f"enable='between(t,{segment * duration_per_segment},{(segment + 1) * duration_per_segment})'"
        )

    drawtext_chain = ','.join(drawtext_filters)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_output:
            output_file = temp_output.name
            (
                ffmpeg
                .input(input_url)
                .output(output_file, vcodec='libx264', pix_fmt='yuv420p', vf=drawtext_chain)
                .run(overwrite_output=True)
            )
            print(f"Video with typing effect saved as {output_file}.")
            
            # Upload to Cloudinary
            uploaded_url = upload_video_to_cloudinary(output_file)
            return uploaded_url
        
    except ffmpeg.Error as e:
        print(f"ffmpeg error during output: {e.stderr.decode()}")
        return None

def AddAudio_and_Subtitles(input_url, video_script, audio_url, font_size=46, font_color='white'):
    try:
        probe_info = ffmpeg.probe(input_url)
        video_duration = float(probe_info['streams'][0]['duration'])
    except KeyError as e:
        print(f"Error extracting duration information from video file: {e}")
        return None
    except FileNotFoundError:
        print("Error: Input video file not found. Please check the file path.")
        return None

    # Split text into words
    words = video_script.split()
    total_words = len(words)

    # Calculate how long each set of 8 words should be displayed based on video duration
    words_per_display = 8
    total_segments = (total_words + words_per_display - 1) // words_per_display  # Ceiling division

    duration_per_segment = video_duration / total_segments

    drawtext_filters = []

    for segment in range(total_segments):
        start_index = segment * words_per_display
        end_index = min(start_index + words_per_display, total_words)

        # Join the current segment of words
        current_words = ' '.join(words[start_index:end_index])

        drawtext_filters.append(
            f"drawtext=text='{current_words}':x=(w-text_w)/2:y=h-th-10:fontsize={font_size}:fontcolor={font_color}:"
            f"box=1:boxcolor=black@0.75:boxborderw=10:"
            f"enable='between(t,{segment * duration_per_segment},{(segment + 1) * duration_per_segment})'"
        )

    drawtext_chain = ','.join(drawtext_filters)

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_output:
            output_file = temp_output.name

            # Download audio to a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio_file:
                audio_response = requests.get(audio_url)
                temp_audio_file.write(audio_response.content)
                temp_audio_path = temp_audio_file.name

            # Ensure inputs are specified separately, without chaining
            video_input = ffmpeg.input(input_url)
            audio_input = ffmpeg.input(temp_audio_path)

            # Add audio and subtitles to video
            (
                ffmpeg
                .output(video_input, audio_input, output_file, vcodec='libx264', pix_fmt='yuv420p', vf=drawtext_chain, acodec='aac', strict='experimental')
                .run(overwrite_output=True)
            )
            print(f"Video with audio and subtitles saved as {output_file}.")

            # Upload to Cloudinary
            uploaded_url = upload_video_to_cloudinary(output_file)
            return uploaded_url

    except ffmpeg.Error as e:
        print(f"ffmpeg error during output: {e.stderr.decode()}")
        return None
    finally:
        # Clean up temporary audio file
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.remove(temp_audio_path)

def GetScript(video_url , video_title , video_description):
    duration = (video_url)
    duration = math.ceil(duration) 
    words = math.ceil(2.3*duration) 

    prompt = f"""
    Generate subtitles for a video titled '{video_title}' with the description '{video_description}'.
    The subtitles should maintain a consistent format and must be synchronized to display for exactly {duration} seconds each.
    Please ensure that the text is concise and adheres to this duration requirement without exceeding or falling short of {duration} seconds.
    Give The Subtitles in a Single Paragraph format without specifying the time duration for each subtitle.
    The Subtitles should be about {words} Words 
    """

    script =  Gemini(prompt)
    word_count = len(script.split())

    return script , word_count , duration 

def FinalProcess(video_url , video_title , video_description):
    script , word_count , duration = GetScript(video_url , video_title , video_description)

    print("\n-----------------------------------\n")
    print(f"The Script is {script}")
    print("\n-----------------------------------\n")
    print(f"The Length of the script is {word_count} Words")
    print("\n-----------------------------------\n")
    print(f"The Duration of the video is {duration} Seconds")
    print("\n-----------------------------------\n")

    audio_url = GenerateAudio(script)
    print(f"The Audio URL is {audio_url}")
    final_video_url = AddAudio_and_Subtitles(video_url , script , audio_url)
    return final_video_url


