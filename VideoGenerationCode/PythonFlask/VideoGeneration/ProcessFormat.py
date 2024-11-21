import ffmpeg

def convert_to_youtube_format(input_file, output_file):
    try:
        (
            ffmpeg
            .input(input_file)
            .output(output_file, vcodec='libx264', acodec='aac', format='mp4')
            .run(overwrite_output=True)
        )
        print(f"Conversion successful! Saved to {output_file}")
    except ffmpeg.Error as e:
        print("Error in conversion:", e.stderr.decode())

# Example usage
input_video = 'assets/Videos/GeneratedVideo133316.mp4'  # Replace with your file path
output_video = 'assets/Videos/ConvertedVideo133316.mp4'  # Replace with your desired output path

convert_to_youtube_format(input_video, output_video)
