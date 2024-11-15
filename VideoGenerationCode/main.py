from pymongo import MongoClient
from flask import Flask, jsonify , request
from VideoGeneration import InfoGenerator  , MediaGeneration , CompileVideo , Subtitles
import os
import uuid
import datetime

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["GenTube"]  
gentube_api_key = os.getenv("GENTUBE_API_KEY")


app = Flask(__name__)

@app.route('/' , methods=['GET' , 'POST'])
def index():
    return jsonify({"message": f"Welcome to the Video Generation API"})
    
@app.route('/deleteAllData', methods=['POST'])
def delete_all_data():
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    print(request)
    try:
        provided_api_key = request.headers.get("Authorization")

        if provided_api_key == gentube_api_key:
            collection = db["Projects"]
            result = collection.delete_many({})
            if result.deleted_count > 0:
                return jsonify({"message": f"Successfully deleted {result.deleted_count} documents."}), 200
            else:
                return jsonify({"message": "No documents found to delete."}), 200
        else:
            return jsonify({"message": "You don't have access."}), 403
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generateThumbnail', methods=['POST'])
def generate_thumbnail():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        title = project.get("title")
        
        # Generate the thumbnail using the title as the prompt
        thumbnail_url = MediaGeneration.GenerateThumbnail(title)
        
        # Update the project with the thumbnail URL
        collection.update_one(
            {"project_id": project_id},
            {"$set": {"thumbnail_url": thumbnail_url}}
        )
        
        return jsonify({"message": "Thumbnail generated successfully", "thumbnail_url": thumbnail_url}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
 


@app.route('/generateVideo/Step1', methods=['POST'])
def generate_video_step1():
    # Video Information Generation
    collection = db["Projects"]
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
        collection.insert_one(video_info)

        return jsonify({
            "project_id": project_id,
            "creation_date": creation_date,
            "title": title,
            "description": description,
            "duration": duration,
            "oneword": oneword
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step2', methods=['POST'])
def generate_video_step2():
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403

    # Video Media Generation
    print("Generating Media")
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})

        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        duration = project.get("duration")
        oneword = project.get("oneword").strip()

        video_urls = MediaGeneration.GenerateMedia(duration, oneword)
        collection.update_one(
            {"project_id": project_id},
            {"$set": {"video_urls": video_urls}}
        )
        return jsonify({"duration": duration, "oneword": oneword, "project_id": project_id, "video_urls": video_urls}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step3', methods=['POST'])
def generate_video_step3():
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access."}), 400
        
    print(request)
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403
    
    print("Compiling Video")
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})

        
        video_urls = project.get("video_urls", [])
        print(video_urls)

        compiled_url = CompileVideo.process_videos(video_urls)
        print(compiled_url)
        collection.update_one(
            {"project_id": project_id},
            {"$set": {"compiled_url": compiled_url}}
        )
        
        return jsonify({"compiled_url": compiled_url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step4', methods=['POST'])
def generate_video_step4():
    if(request==None or request.get_json()==None):
        return jsonify({"message": "You don't have access."}), 400
        
    print(request)
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403
    
    print("Giving Subtitles")

    request_data = request.get_json()
    project_id = request_data.get("project_id")
    collection = db["Projects"]
    project = collection.find_one({"project_id": project_id})
    video_url = project.get("compiled_url")
    title = project.get("title")
    description = project.get("description")


    final_video_url = Subtitles.FinalProcess(video_url = video_url , video_title = title , video_description = description)
    print(final_video_url)
    collection.update_one(
        {"project_id": project_id},
        {"$set": {"final_video_url": final_video_url}}
    )

    return jsonify({f"final_video_url": final_video_url}), 200

   

if __name__ == "__main__":
    app.run(debug=True)


