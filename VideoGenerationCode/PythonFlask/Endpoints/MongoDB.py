from flask import Blueprint , request , jsonify
import uuid
import tempfile
import base64
import os
import requests
import bcrypt
from datetime import datetime
from pymongo import MongoClient
from Models.OnlineUpload import upload_image_to_cloudinary , upload_audio_to_cloudinary , upload_video_to_cloudinary



MongoDb = Blueprint('MongoDb', __name__)


mongo_uri = os.getenv("MONGO_URI")
gentube_api_key = os.getenv("GENTUBE_API_KEY")
client = MongoClient(mongo_uri)
db = client["GenTube"]




@MongoDb.route('/deleteAllData', methods=['POST'])
def delete_all_data():
    collection = db["Projects"]
    result = collection.delete_many({})
    if result.deleted_count > 0:
        return jsonify({"message": f"Successfully deleted {result.deleted_count} documents."}), 200
    else:
        return jsonify({"message": "No documents found to delete."}), 200

@MongoDb.route('/deleteDataById', methods=['POST'])
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

@MongoDb.route('/addData', methods=['POST'])
def add_data():
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

@MongoDb.route('/uploadData', methods=['POST'])
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

@MongoDb.route('/uploadImage', methods=['POST'])
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

@MongoDb.route('/uploadAudio', methods=['POST'])
def upload_audio():
    print("a request came")
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        base64_audio = request_data.get("base64_audio")
        
        if not base64_audio:
            return jsonify({"error": "No base64 audio provided"}), 400
        
        # Convert base64 audio to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as temp_file:
            temp_file.write(base64.b64decode(base64_audio))
            temp_file_path = temp_file.name
        
        # Upload the audio to Cloudinary using the temporary file path
        audio_url = upload_audio_to_cloudinary(temp_file_path)
        
        return jsonify({"message": "Audio uploaded successfully", "audio_url": audio_url}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@MongoDb.route('/uploadVideo', methods=['POST'])
def upload_video():
    print("A request came to upload video")
    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        video_url = request_data.get("video_url")
        
        if not video_url:
            return jsonify({"error": "No video URL provided"}), 400
        
        # Download the video from the provided URL
        response = requests.get(video_url)
        if response.status_code != 200:
            return jsonify({"error": "Failed to download video from the provided URL"}), 400
        
        # Save the video to a temporary file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            temp_file.write(response.content)
            temp_file_path = temp_file.name
        
        # Upload the video to Cloudinary using the temporary file path
        uploaded_video_url = upload_video_to_cloudinary(temp_file_path)
        
        return jsonify({"message": "Video uploaded successfully", "video_url": uploaded_video_url}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@MongoDb.route('/GetProjects', methods=['POST'])
def get_projects():
    print("Required API Key "  , gentube_api_key)

    if request is None or request.get_json() is None:
        return jsonify({"message": "You don't have access. Please Provide a valid API Key"}), 400
        
    provided_api_key = request.headers.get("Authorization")
    print("Provided API Key " , provided_api_key)

    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        filter_key = request_data.get("filter_key")
        filter_value = request_data.get("filter_value")

        collection = db["Projects"]
        
        # If filter parameters are provided, apply the filter
        if filter_key and filter_value:
            query = {filter_key: filter_value}
            projects = list(collection.find(query, {"_id": 0}))
        else:
            # If no filter parameters, return all projects
            projects = list(collection.find({}, {"_id": 0}))

        print(projects)
        return jsonify(projects)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@MongoDb.route('/updateProject', methods=['POST'])
def update_project():
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
            return jsonify({"error": "Project ID, key and value must be provided"}), 400

        collection = db["Projects"]
        result = collection.update_one(
            {"project_id": project_id},
            {"$set": {key: value}}
        )

        if result.modified_count > 0:
            return jsonify({"message": f"Successfully updated project {project_id}"}), 200
        else:
            return jsonify({"message": "No project found with the provided ID"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@MongoDb.route('/createUser', methods=['POST'])
def create_user():
    if request is None or request.get_json() is None:
        return jsonify({"message": "Invalid request data"}), 400
        
    provided_api_key = request.headers.get("Authorization")
    if provided_api_key != gentube_api_key:
        return jsonify({"message": "Invalid API Key"}), 403
    
    try:
        request_data = request.get_json()
        username = request_data.get("username")
        email = request_data.get("email") 
        password = request_data.get("password")

        if not username or not email or not password:
            return jsonify({"error": "Username, email and password must be provided"}), 400

        # Check if user already exists
        users_collection = db["Users"]
        existing_user = users_collection.find_one({"$or": [
            {"username": username},
            {"email": email}
        ]})

        if existing_user:
            return jsonify({"error": "Username or email already exists"}), 409

        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        # Generate user ID
        user_id = str(uuid.uuid4())

        # Create new user document
        new_user = {
            "user_id": user_id,
            "username": username,
            "email": email,
            "password": hashed_password,
            "created_at": datetime.now().strftime("%d/%m/%Y")
        }

        # Insert into MongoDB
        result = users_collection.insert_one(new_user)

        if result.inserted_id:
            return jsonify({
                "message": "User created successfully",
                "user_id": user_id,
                "username": username,
                "email": email
            }), 201
        else:
            return jsonify({"error": "Failed to create user"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#####################
