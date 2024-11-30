from flask import Blueprint , request , jsonify
import uuid
import tempfile
import base64
import os
from pymongo import MongoClient
from Models.OnlineUpload import upload_image_to_cloudinary , upload_audio_to_cloudinary

mongo_uri = os.getenv("MONGO_URI")
gentube_api_key = os.getenv("GENTUBE_API_KEY")
client = MongoClient(mongo_uri)
db = client["GenTube"]


MongoDb = Blueprint('MongoDb', __name__)

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
