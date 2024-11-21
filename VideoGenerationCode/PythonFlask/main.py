from pymongo import MongoClient
from flask import Flask, jsonify , request
from VideoGeneration import InfoGenerator  , MediaGeneration , CompileVideo , Subtitles
import os
import uuid
import datetime
from Models.OnlineUpload import upload_image_to_cloudinary
import tempfile
import base64   
import threading
import time

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["GenTube"]  
gentube_api_key = os.getenv("GENTUBE_API_KEY")
task_status = {}


app = Flask(__name__)

@app.route('/' , methods=['GET' , 'POST'])
def index():
    return jsonify({"message": f"Welcome to the Video Generation API"})
    
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
        print("Generating Thumbnail for Project ID:", project_id)
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})
        if not project:
            return jsonify({"error": "Project not found"}), 404
        
        title = project.get("title")
        
        thumbnail_url = MediaGeneration.GenerateThumbnail(title)
        
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

        return jsonify(video_info), 200

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


@app.route('/uploadData', methods=['POST'])
def upload_video_data():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"})
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"})
    
    try:
        request_data = request.get_json()
        project_id = str(uuid.uuid4())
        title = request_data.get("title")
        description = request_data.get("description")
        duration = request_data.get("duration")
        one_word = request_data.get("oneWord")
        created_at = request_data.get("createdAt")

        collection = db["Projects"]
        project_data = {
            "project_id": project_id,
            "title": title,
            "description": description,
            "duration": duration,
            "oneWord": one_word,
            "createdAt": created_at
        }

        collection.insert_one(project_data)
        
        return jsonify({"message": "Data uploaded successfully", "project_id": project_id}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/deleteAllData', methods=['POST'])
def delete_all_data():
    collection = db["Projects"]
    result = collection.delete_many({})
    if result.deleted_count > 0:
        return jsonify({"message": f"Successfully deleted {result.deleted_count} documents."}), 200
    else:
        return jsonify({"message": "No documents found to delete."}), 200

@app.route('/deleteDataById', methods=['POST'])
def delete_data_by_id():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")

        collection = db["Projects"]
        result = collection.delete_one({"project_id": project_id})
        
        if result.deleted_count > 0:
            return jsonify({"message": f"Successfully deleted project with ID {project_id}."}), 200
        else:
            return jsonify({"message": "No project found with the provided ID."}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/uploadImage', methods=['POST'])
def upload_image():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        base64_image = request_data.get("base64_image")
        
        if not base64_image:
            return jsonify({"error": "No base64 image provided"}), 400
        
        # Convert base64 image to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
            temp_file.write(base64.b64decode(base64_image))
            temp_file_path = temp_file.name
        
        # Upload the image to Cloudinary using the temporary file path
        thumbnail_url = upload_image_to_cloudinary(temp_file_path)
        
        return jsonify({"message": "Image uploaded successfully", "thumbnail_url": thumbnail_url}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/updateCollection', methods=['POST'])
def update_collection():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        key = request_data.get("key")
        value = request_data.get("value")
        
        if not project_id or not key or not value:
            return jsonify({"error": "Video ID, key, and value must be provided"}), 400
        
        collection = db["Projects"]
        result = collection.update_one(
            {"project_id": project_id},
            {"$set": {key: value}}
        )
        
        if result.matched_count > 0:
            return jsonify({"message": f"Successfully updated project with project ID {project_id}."}), 200
        else:
            return jsonify({"message": "No project found with the provided project ID."}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/concatVideos', methods=['POST'])
def concat_videos():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access."}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403
    
    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})

        video_urls = project.get("video_urls", [])

        temp_files = []
        for url in video_urls:
            print(f"Downloading video from URL: {url}")
            temp_file = CompileVideo.download_video(url)
            temp_files.append(temp_file)
        
        # Generate a unique task ID to track the processing
        task_id = str(uuid.uuid4())
        
        # Initialize task status in memory
        task_status[task_id] = {"status": "Processing", "url": None}
        
        # Start the video processing in a separate thread
        def process_videos():
            try:
                compiled_url = CompileVideo.process_videos(temp_files)
                if compiled_url:
                    task_status[task_id]["status"] = "Completed"
                    task_status[task_id]["url"] = compiled_url
                    collection.update_one(
                        {"project_id": project_id},
                        {"$set": {"compiled_url": compiled_url}}
                    )
                else:
                    task_status[task_id]["status"] = "Failed"
            except Exception as e:
                task_status[task_id]["status"] = f"Error: {str(e)}"
        
        # Start the background task
        threading.Thread(target=process_videos).start()
        
        # Return task_id immediately to avoid timeout
        return jsonify({"message": "Video processing started", "task_id": task_id}), 202

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/dummytask', methods=['POST', 'GET'])
def dummytask():
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access."}), 400

    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "You don't have access."}), 403

    try:
        request_data = request.get_json()
        project_id = request_data.get("project_id")
        collection = db["Projects"]
        project = collection.find_one({"project_id": project_id})

        video_urls = project.get("video_urls", [])

        temp_files = []
        for url in video_urls:
            print(f"Downloading video from URL: {url}")
            temp_file = CompileVideo.download_video(url)
            temp_files.append(temp_file)

        # Generate a unique task ID to track the processing
        task_id = str(uuid.uuid4())

        # Initialize task status in memory
        task_status[task_id] = {"status": "Processing", "url": None}

        # Start the video processing in a separate thread
        def process_videos():
            try:
                compiled_url = CompileVideo.process_videos(temp_files)
                if compiled_url:
                    task_status[task_id]["status"] = "Completed"
                    task_status[task_id]["url"] = compiled_url
                    collection.update_one(
                        {"project_id": project_id},
                        {"$set": {"compiled_url": compiled_url}}
                    )
                else:
                    task_status[task_id]["status"] = "Failed"
            except Exception as e:
                task_status[task_id]["status"] = f"Error: {str(e)}"

        # Start the background task
        threading.Thread(target=process_videos).start()

        # Return task_id immediately to avoid timeout
        return jsonify({"message": "Video processing started", "task_id": task_id}), 202

    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route('/task_status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    # Get the status of the task using task_id
    status_info = task_status.get(task_id, {"status": "Unknown task ID", "url": None})
    return jsonify(status_info)
    
      


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
