import ffmpeg
import os
import random



def is_valid_video(video):
    """Check if the video file is valid."""
    try:
        ffmpeg.probe(video)
        return True
    except ffmpeg.Error:
        return False

def concat_videos(video_list, output):
    target_width = 1920
    target_height = 1080
    video_streams = []

    print("\nProcessing videos:")

    for video in video_list:
        if is_valid_video(video):
            try:
                # Create input stream and apply filters
                video_stream = (
                    ffmpeg.input(video)
                    .filter('scale', target_width, target_height)
                    .filter('fps', fps=24, round='up')  # Ensures uniform frame rate
                    .filter('setsar', '1')  # Corrects pixel aspect ratio
                )
                video_streams.append(video_stream)
                print(f"Added valid video: {video}")

            except ffmpeg.Error as e:
                print(f"Error processing video: {video}")
                print(f"Error: {e}")
        else:
            print(f"Skipping invalid video: {video}")

    if len(video_streams) < 2:
        print("Not enough valid videos to concatenate.")
        return
    
    print("\nConcatenating videos...")

    try:
        concat_video = ffmpeg.concat(*video_streams, v=1, a=0)  # For now, disabling audio
        concat_video.output(output).run()
        print("Videos concatenated successfully!")

    except ffmpeg.Error as e:
        print("Error during concatenation:")
        if e.stderr:
            print(e.stderr.decode())
        else:
            print("No error output from ffmpeg.")
    
    print("Concatenation process completed.")

def delete_existing_video(video_path):   
    if os.path.exists(video_path):
        os.remove(video_path)
        print(f"Deleted existing video: {video_path}")

def CompileVideo(output_path="VideoGenerationCode/Outputs/GeneratedVideo.mp4" , animated_path="VideoGenerationCode/Outputs/Animated" , video_path="VideoGenerationCode/Outputs/Videos"):
    print("\nStep 4/5 - Compiling Video\n")
    delete_existing_video(output_path)

    animated_images_path = [animated_path+'/' + video for video in os.listdir(animated_path)]
    videos_path = [video_path + '/' + video for video in os.listdir(video_path)]

    video_content = videos_path + animated_images_path
    random.shuffle(video_content)

    print("Videos to be processed:")
    print(video_content)


    concat_videos(video_content, output_path )


"""
Alternate Method-------------------
with open('videos.txt', 'w') as f:
    for media in video_content:
        f.write(f"file '{media}'\n")

# Scaling and converting the videos to a common resolution (1920x1080)
scaled_files = []
for i, media in enumerate(video_content):
    scaled_output = f"Outputs/SubVideos/Video{i+1}.mp4"
    scaled_files.append(scaled_output)
    subprocess.run([
        'ffmpeg', '-i', media, 
        '-vf', 'scale=1920:1080,setsar=1:1', 
        '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', 
        scaled_output
    ])


with open('scaled_videos.txt', 'w') as f:
    for scaled_media in os.listdir("Outputs/SubVideos"):
        f.write(f"file 'Outputs/SubVideos/{scaled_media}'\n")

subprocess.run([
    'ffmpeg', '-f', 'concat', '-safe', '0', '-i', 'scaled_videos.txt', 
    '-c', 'copy', 'GeneratedVideo.mp4'
])

print("Videos Generated successfully into GeneratedVideo.mp4")


os.remove('videos.txt')
os.remove('scaled_videos.txt')
"""
