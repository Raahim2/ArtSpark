from flask import Blueprint , request , jsonify
import uuid
import datetime
import os
from VideoGeneration import InfoGenerator , MediaGeneration , Subtitles , CompileVideo

GenerateVideo = Blueprint('GenerateVideo', __name__)
gentube_api_key = os.getenv("GENTUBE_API_KEY")

@GenerateVideo.route('/Step1', methods=['POST'])
def generate_video_step1():
    # Video Information Generation
    try:
        if request.content_type != 'application/json':
            return jsonify({"error": "415 Unsupported Media Type: Did not attempt to load JSON data because the request Content-Type was not 'application/json'."}), 415

        if request is None or request.get_json() is None:
            return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
        provided_api_key = request.headers.get("Authorization")

        if provided_api_key != gentube_api_key:
            return jsonify({"message": "Invalid API Key"}), 403

        request_data = request.get_json()
        prompt = request_data.get("prompt", "Default Prompt")
        duration = request_data.get("duration", 20)
        print(f"Received prompt: {prompt}")
        print(f"Received duration: {duration}")
        
        data = InfoGenerator.GenerateInfo(base_prompt=prompt, duration=duration)

        project_id = str(uuid.uuid4())
        creation_date = datetime.datetime.now().isoformat()
        title = data.get("Video Title")
        description = data.get("Video Description")
        oneword = data.get("OneWord")
       
        video_info = {
            "project_id": project_id,
            "creation_date": creation_date,
            "title": title,
            "description": description,
            "duration": duration,
            "oneword": oneword
        }

        return jsonify(video_info), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
       
@GenerateVideo.route('/Step2', methods=['POST'])
def generate_video_step2():
    #Get Video Urls
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403

    # Video Media Generation
    print("Generating Media")
    try:
        request_data = request.get_json()
        duration = request_data.get("duration")
        oneword = request_data.get("oneword").strip()

        video_urls = MediaGeneration.GenerateMedia(duration, oneword)
       
        return jsonify({"duration": duration, "oneword": oneword, "video_urls": video_urls}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@GenerateVideo.route('/Step3', methods=['POST'])
def generate_video_step3():
    #Compile Video
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access."}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403
    
    print("Compiling Video")

    request_data = request.get_json()
    video_urls = request_data.get("video_urls")

    compiled_video_url = CompileVideo.process_videos(video_urls=video_urls)
    print(compiled_video_url)
    

    return jsonify({f"compiled_video_url": compiled_video_url}), 200

@GenerateVideo.route('/Step4', methods=['POST'])
def generate_video_step4():
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access."}), 400
        
    print(request)
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403
    
    print("Giving Subtitles")

    request_data = request.get_json()
    video_url = request_data.get("compiled_url")
    title = request_data.get("title")
    description = request_data.get("description")


    final_video_url = Subtitles.FinalProcess(video_url = video_url , video_title = title , video_description = description)
    print(final_video_url)


    return jsonify({f"final_video_url": final_video_url}), 200

