# python -m VideoGeneration.PutAudio

import subprocess
from Models.GenAudio import TextToSpeech
import json
import os

def add_audio_to_video(video_file, audio_file, output_file):
    print("Adding Audio To Video")
    command = [
        'ffmpeg',
        '-i', video_file,                    # Input video file
        '-i', audio_file,                    # Input audio file
        '-c:v', 'copy',                      # Copy the video stream without re-encoding
        '-c:a', 'aac',                       # Encode the audio stream as AAC
        '-b:a', '192k',                     # Set audio bitrate to 192 kbps
        '-shortest',                         # Stop writing the output file when the shortest input ends
        '-y',                                 # Overwrite output file without asking
        '-filter:a', 'volume=1.5',           # Increase audio volume
        output_file                          # Output file path
    ]

    print("Running command:", " ".join(command))
    
    try:
        subprocess.run(command, check=True)
        print(f"Successfully added audio to the video. Output saved as: {output_file}")
    except subprocess.CalledProcessError as e:
        print("Error while adding audio:", e)

def delete_existing_audio(audio_path):
    try:
        if os.path.exists(audio_path):
            os.remove(audio_path)
            print(f"Deleted existing audio: {audio_path}")
    except Exception as e:
        print(f"Error while deleting existing audio: {e}")

def TranscribeAudio(video_path="VideoGenerationCode/Outputs/VideoWithSubtitles.mp4" , audio_path="VideoGenerationCode/Outputs/Audio/audio.wav" , output_path="VideoGenerationCode/Outputs/FinalVideo.mp4" , data_path="VideoGenerationCode/Outputs/data.json"):
    print("Transcripting Audio...")

    with open(data_path, "r") as f:
        data = json.load(f)

    TextToSpeech(data['Subtitles'] , audio_path=audio_path)
    
    add_audio_to_video(video_path , audio_path , output_path)
