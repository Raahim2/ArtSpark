# python -m VideoGeneration.MediaGeneration  
import json
from Models.GenImage import  *
import math
import random
import os
from moviepy.editor import VideoFileClip

def delete_existing_media(video_path , image_path):
    print(f"Deleting Existing Media in {video_path} and {image_path}")
    print(os.path.exists(video_path))
    
        
    try:
        if os.path.exists(video_path):
            for vid in os.listdir(video_path):
                os.remove(video_path+'/' + vid)
                print(f"Deleted {vid}")

        if os.path.exists(image_path):
            for im in os.listdir(image_path):
                os.remove(image_path+'/' + im)
                print(f"Deleted {im}")
    except Exception as e:
        print(f"An error occurred while deleting media: {e}")
    

def GenerateMedia(duration , oneword , video_path="D:/Raahim/Artificial Intellegence/GenTube/VideoGenerationCode/Outputs/Videos",image_path="D:/Raahim/Artificial Intellegence/GenTube/VideoGenerationCode/Outputs/Images" , data_path="D:/Raahim/Artificial Intellegence/GenTube/VideoGenerationCode/Outputs/data.json"):
    print("\nStep 2/5 - Generating Media\n") 

    with open(data_path, "r") as f:
        data = json.load(f)

    print(f"FinalVideo Duration {duration} Seconds")

    vid_duration=math.ceil((2/3)*duration)
    im_duration=math.ceil((1/3)*duration)

    print(f"Video Duration {vid_duration} Seconds")
    print(f"Image Duration {im_duration} Seconds")


    videos = get_pexels_videos(oneword,25 , tolerance=0.5 )
    images = get_pexels_images(oneword,50 ,tolerance=0.5)


    print(f"Videos Found {len(videos)}")
    print(f"Images Found {len(images)}")

    vid_count = 1
    im_count = 1

    while(duration > 0):
        video_url = random.choice(videos)

        print(f"Genearting Video {vid_count}")
        download_video(video_url, f"{video_path}/Video{vid_count}.mp4")
        videos.remove(video_url)

        clip = VideoFileClip(f"{video_path}/Video{vid_count}.mp4")
        clip_duration = math.ceil(clip.duration)
        duration = duration - clip_duration
        vid_count = vid_count +1 


    while(im_count < vid_count):
        image_url = random.choice(images)

        print(f"Genearting Image {im_count}")
        download_image(image_url , f"{image_path}/Image{im_count}.png")
        images.remove(image_url)

        im_count = im_count + 1 



# GenerateMedia(10 , "Burj Khalifa")


# videos = get_pexels_videos(oneword,vid_count*2 , tolerance=0.2 )
# images = get_pexels_images(oneword,im_count*2 ,tolerance=0.5)

# i=1
# for video in videos:
#     print(f"Generating Video {i}")
#     download_video(video , filename=f"Outputs/Videos/Video{i}.mp4")
#     i = i+1

# i=1
# for image in images:
#     print(f"Generating Image {i}")
#     download_video(image , filename=f"Outputs/Images/Image{i}.png")
#     i = i+1



"""
Aletrnate Method
for title in titles:
    print(f"Generating for :{title}")
    videos = get_pexels_videos(title , num_video=3)
    images = get_pexels_images(title , num_image=5)

    for video in videos:
        download_video(video , f"Outputs/Videos/Video{vid_count}.mp4")
        vid_count = vid_count +1
        print(f"Video {vid_count} Generated")

    for image in images:
        download_image(image , f"Outputs/Images/Image{im_count}.png")
        im_count = im_count +1
        print(f"Photo {im_count} Generated")
"""










