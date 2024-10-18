from flask import Flask, jsonify, request
from flask_cors import CORS
from VideoGeneration import InfoGenerator , MediaGeneration , ImageAnimation , CompileVideo , Subtitles , AudioTranscribtion
from Models.GenImage import generate_image , get_pexels_videos , download_video
import json
import os
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/' , methods=['GET'])
def index():
    return jsonify({"message": "Welcome to the Video Generation API"}), 200

@app.route('/generateThumbnail', methods=['GET'])
def generate_thumbnail():
    print("Generating Thumbnail")
    try:
        with open("VideoGenerationCode/Outputs/data.json", "r") as f:
            data = json.load(f)

        title = data.get("Video Title")
        prompt = f"Thumbnail of a video with title {title}"
        print(f"Generating Thumbnail for {title}")
        generate_image(prompt=prompt, output_path='assets/Images/thumbnail.png')
        # import time
        # time.sleep(5)
        img = Image.open('assets/Images/thumbnail.png')

        width, height = img.size
        new_width = width
        new_height = int(width * 9 / 16)

        if new_height > height:
            new_height = height
            new_width = int(height * 16 / 9)

        resized_img = img.resize((new_width, new_height), Image.LANCZOS)

        resized_img.save('assets/Images/thumbnail.png')

        return jsonify({"message": "Thumbnail Generated and resized to 16:9 aspect ratio"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step1', methods=['POST' , 'GET'])
def generate_video_step1():
    # Video Infromation Generation
    try:
        # if request.is_json:
        #     data = request.get_json()
        # else:
        #     data = request.form.to_dict()

        # prompt = data.get('prompt', '')
        # duration = int(data.get('duration', 30))
        prompt = "Burj Khalifa History"
        duration = 10
        print(f"Received prompt: {prompt}")
        print(f"Received duration: {duration}")
        
        InfoGenerator.GenerateInfo(base_prompt=prompt, duration=duration)

        with open("VideoGenerationCode/Outputs/data.json", "r") as f:
            data = json.load(f)

        title = data.get("Video Title")
        desc = data.get("Video Description")
        duration = data.get("Video Duration")
        oneword = data.get("OneWord")
        return jsonify({"title": title, "description": desc, "duration": duration , "oneword": oneword, "Next": 'Generating Media'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step2', methods=['GET'])
def generate_video_step2():
    # Video Media Generation
    print("Generating Media")
    try:
        with open("VideoGenerationCode/Outputs/data.json", "r") as f:
            data = json.load(f)

        duration = data.get("Video Duration")
        oneword = data.get("OneWord")

        video_path="VideoGenerationCode/Outputs/Videos"
        image_path="VideoGenerationCode/Outputs/Images" 

        MediaGeneration.delete_existing_media(video_path , image_path)
        MediaGeneration.GenerateMedia(duration , oneword , video_path , image_path)
        
        return jsonify({"oneword": oneword, "duration": duration , "Next": 'Animating Media'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step3', methods=['GET'])
def generate_video_step3():
    print("Animating Media")
    # Video Media Animation
    try:
        Animated_path="VideoGenerationCode/Outputs/Animated" 
        Images_path="VideoGenerationCode/Outputs/Images"
        ImageAnimation.delete_existing_animated_media(Animated_path)
        ImageAnimation.AnimateMedia(Animated_path , Images_path )
        
        return jsonify({"Next": 'Compiling Video'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step4', methods=['GET'])
def generate_video_step4():
    print("Compiling Video")
    # Video Compilation
    try:
        output_path="VideoGenerationCode/Outputs/GeneratedVideo.mp4"
        animated_path="VideoGenerationCode/Outputs/Animated"
        videos_path="VideoGenerationCode/Outputs/Videos"
        CompileVideo.delete_existing_video(output_path)
        CompileVideo.CompileVideo(output_path , animated_path , videos_path)
        
        return jsonify({"Next": 'Giving Subtitles'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step5', methods=['GET'])
def generate_video_step5():
    print("Giving Subtitles")
    # Video Subtitles
    try:
        video_path="VideoGenerationCode/Outputs/GeneratedVideo.mp4" 
        output_path="VideoGenerationCode/Outputs/VideoWithSubtitles.mp4" 
        data_path="VideoGenerationCode/Outputs/data.json"
        Subtitles.delete_existing_subtitles(output_path)
        Subtitles.GenerateSubtitles(video_path , output_path , data_path)
        
        return jsonify({"Next": 'Transcribing Audio'}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step6', methods=['GET'])
def generate_video_step6():
    
    print("Transcribing Audio")
    from datetime import datetime
    current_time = datetime.now().strftime('%H%M%S')
    print(f"Current time: {current_time}")

    assets_folder = "assets/Videos"
    
    if os.path.exists(assets_folder):
        for filename in os.listdir(assets_folder):
            file_path = os.path.join(assets_folder, filename)
            try:
                if os.path.isfile(file_path):
                    os.remove(file_path)
                    print(f"Deleted file: {file_path}")
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")
    else:
        print(f"Assets folder does not exist: {assets_folder}")

    try:
        video_path="VideoGenerationCode/Outputs/VideoWithSubtitles.mp4" 
        audio_path="VideoGenerationCode/Outputs/Audio/audio.wav" 
        output_path=f"assets/Videos/GeneratedVideo{current_time}.mp4" 
        data_path="VideoGenerationCode/Outputs/data.json"
        AudioTranscribtion.delete_existing_audio(audio_path)
        AudioTranscribtion.TranscribeAudio(video_path , audio_path , output_path , data_path)
        
        return jsonify({"Next": 'Done', "file_path": output_path}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploadVideo2', methods=['GET'])
def upload_video_to_youtube2():
    print("Request Came to Uplaod Video")
    try:
        from Models.YTUplaod import upload_video , get_authenticated_service

        with open("VideoGenerationCode/Outputs/data.json", "r") as f:
            data = json.load(f)

        title = data.get("Video Title")
        desc = data.get("Video Description")

        id = upload_video(youtube=get_authenticated_service() , file_path='assets/Videos/GeneratedVideo170653.mp4' , title=title , description=desc , tags=['tag1', 'tag2'] , category_id=22)

        return jsonify({"video_id": id, "message": "Video uploaded successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploadVideo', methods=['GET'])
def upload_video_to_youtube():
    print("Request Came to Uplaod Video")
    return jsonify({"message": "Video uploaded successfully"}), 200
    



@app.route('/', methods=['GET'])
def show_form():
    try:
        form_html = '''
        <html>
            <body>
                <h2>Video Generation Form</h2>
                <form action="/generateVideo/Step1" method="post">
                    <label for="prompt">Prompt:</label><br>
                    <input type="text" id="prompt" name="prompt"><br>
                    <label for="duration">Duration (seconds):</label><br>
                    <input type="number" id="duration" name="duration" value="30"><br><br>
                    <input type="submit" value="Generate Video">
                </form>
            </body>
        </html>
        '''
        return form_html, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Run the app with HTTPS
    app.run(debug=True, host='0.0.0.0', port=5000)

# To access from mobile devices, use your computer's local IP address with https
# For example: https://192.168.0.103:5000