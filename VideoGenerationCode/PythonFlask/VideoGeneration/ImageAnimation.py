import os
import ffmpeg

def delete_existing_animated_media(Animated_path):
    if os.path.exists(Animated_path):
        for vid in os.listdir(Animated_path):
            os.remove(f'{Animated_path}/{vid}')
            print(f"Deleted {vid}")
    else:
        print("No such path exists")

def animate_image_to_video(image_path, output_path, duration=3, fps=12):
    try:
        # Get the image dimensions
        probe = ffmpeg.probe(image_path)
        width = probe['streams'][0]['width']
        height = probe['streams'][0]['height']

        # Check if width and height are divisible by 2
        if width % 2 != 0 or height % 2 != 0:
            # Resize the image to ensure dimensions are even
            new_width = width + (width % 2)
            new_height = height + (height % 2)
            resized_image_path = f"resized_{os.path.basename(image_path)}"
            
            ffmpeg.input(image_path).output(resized_image_path, 
                                             vf=f'scale={new_width}:{new_height}').run(overwrite_output=True)
            image_path = resized_image_path  # Update image path to resized image

        # Create the animated video
        (
            ffmpeg
            .input(image_path, loop=1, t=duration)
            .output(output_path, vcodec='libx264', pix_fmt='yuv420p', vf=f'fps={fps}')
            .run(overwrite_output=True)
        )
        print(f"Animated video saved at: {output_path}")

        # Remove the resized image if it was created
        if 'resized_image_path' in locals() and os.path.exists(resized_image_path):
            os.remove(resized_image_path)
            
    except ffmpeg.Error as e:
        # Handle the error case properly
        if e.stderr is not None:
            print("An error occurred:", e.stderr.decode())
        else:
            print("An error occurred, but no stderr available.")

def AnimateMedia(Animated_path="VideoGenerationCode/Outputs/Animated" , Images_path="VideoGenerationCode/Outputs/Images"):
    print("\nStep 3/5 - Animating Media\n")
    delete_existing_animated_media(Animated_path)

    images = os.listdir(Images_path)

    i = 1
    for image in images:
        print(f"Animating  : {Images_path}/{image}")
        animate_image_to_video(image_path=f"{Images_path}/{image}" , output_path=f"{Animated_path}/Animated{i}.mp4")
        i = i+1












        