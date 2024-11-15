# python -m VideoGeneration.MediaGeneration  
from Models.GenImage import get_pexels_videos , generate_image
from Models.OnlineUpload import upload_image_to_cloudinary
import random
import tempfile


def GenerateMedia(duration , oneword ):
    print("\nStep 2/5 - Generating Media\n") 

    print(f"Video Duration {duration} Seconds")
    print(f"One Word {oneword}")

    video_data = get_pexels_videos(oneword, 25, tolerance=0.5)
    videos = [video[0] for video in video_data]  # Extract video URLs
    durations = [video[1] for video in video_data] 

    print(f"Videos Found {len(videos)}")
    print(f"Durations Found {durations}")


    vid_count = 1
    video_urls = []

    while(duration > 0):
        video_url = random.choice(videos)
        print(f"Video URL {video_url}")

        print(f"Genearting Video {vid_count}")
        video_urls.append(video_url)
        videos.remove(video_url)

        duration = duration - durations[vid_count-1]
        vid_count = vid_count +1 

    return video_urls


def GenerateThumbnail(prompt):
    print(f"Generating Thumbnail for {prompt}")

    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        output_path = temp_file.name
        generate_image(prompt, output_path)

    thumbnail_url = upload_image_to_cloudinary(output_path)

    print(f"Thumbnail URL: {thumbnail_url}")
    return thumbnail_url






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










