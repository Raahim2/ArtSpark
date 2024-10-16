# python -m VideoGeneration.Subtitles

import ffmpeg
import os
from moviepy.editor import VideoFileClip
import math
from Models.GenText import MistralChatBot
import json 


def create_typing_effect2(input_video, text, output_file='output.mp4', font_size=64, font_color='white'):
    try:
        probe_info = ffmpeg.probe(input_video)
        video_duration = float(probe_info['streams'][0]['duration'])
    except KeyError as e:
        print(f"Error extracting duration information from video file: {e}")
        return
    
    except FileNotFoundError:
        print("Error: Input video file not found. Please check the file path.")
        return

    # Split text into words
    words = text.split()
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
            f"drawtext=text='{current_words}':x=(w-text_w)/2:y=(h-text_h)/2:fontsize={font_size}:fontcolor={font_color}:"  
            f"enable='between(t,{segment * duration_per_segment},{(segment + 1) * duration_per_segment})'"
        )

    drawtext_chain = ','.join(drawtext_filters)

    try:
        (
            ffmpeg
            .input(input_video)
            .output(output_file, vcodec='libx264', pix_fmt='yuv420p', vf=drawtext_chain)
            .run(overwrite_output=True)
        )
        print(f"Video with typing effect saved as {output_file}.")
        
    except ffmpeg.Error as e:
        print(f"ffmpeg error during output: {e.stderr.decode()}")

def create_typing_effect(input_video, text, output_file='output.mp4', font_size=64, font_color='white'):
    try:
        probe_info = ffmpeg.probe(input_video)
        video_duration = float(probe_info['streams'][0]['duration'])
    except KeyError as e:
        print(f"Error extracting duration information from video file: {e}")
        return
    
    except FileNotFoundError:
        print("Error: Input video file not found. Please check the file path.")
        return

    # Split text into words
    words = text.split()
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
        (
            ffmpeg
            .input(input_video)
            .output(output_file, vcodec='libx264', pix_fmt='yuv420p', vf=drawtext_chain)
            .run(overwrite_output=True)
        )
        print(f"Video with typing effect saved as {output_file}.")
        
    except ffmpeg.Error as e:
        print(f"ffmpeg error during output: {e.stderr.decode()}")

def delete_existing_subtitles(subtitles_path):
    if(os.path.exists(subtitles_path)):
        os.remove(subtitles_path)
        print(f"Deleted existing subtitles: {subtitles_path}")

def GenerateSubtitles(video_path="VideoGenerationCode/Outputs/GeneratedVideo.mp4" , output_path="VideoGenerationCode/Outputs/VideoWithSubtitles.mp4" , data_path="VideoGenerationCode/Outputs/data.json"):
    print('5/6 Generating Subtitles')

    delete_existing_subtitles(output_path)

    video = VideoFileClip(video_path)
    duration = math.ceil(video.duration)  
    words = math.ceil(2.4*duration)

    with open(data_path, 'r') as file:
        data = json.load(file)

    Video_Title = data.get('Video Title')
    print(Video_Title)

    prompt = f"""
    Generate description on the topic `{Video_Title}`

    The description should be in One Paragraph and should be about{words} Words

    The description should only include information about the Topic nothing else and it should about {words} Words

    Output Only The Description of the topic , Nothing Else!

    """

    script =  MistralChatBot(prompt)
    script = script.replace(prompt , "")
    word_count = len(script.split())

    script = script.replace("'" ,'')
    script = script.replace('"' ,'')


    print(script)
    print(f"\nThe Length of the script is {word_count} Words Expected {words} Words")


    data['Subtitles'] = script
    data['Words'] = word_count
    data['Final Duration'] = duration

    with open(data_path, 'w') as file:
        json.dump(data, file, indent=4)

    create_typing_effect(input_video=video_path ,text=script , output_file=output_path)




