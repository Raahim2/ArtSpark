from pymongo import MongoClient
from flask import Flask, jsonify
from VideoGeneration import InfoGenerator  , MediaGeneration , CompileVideo , Subtitles
import os
import uuid
import datetime

mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client["GenTube"]  

current_project_id = "d6fd1126-d070-4570-b079-30e61883a9d2"

app = Flask(__name__)

@app.route('/' , methods=['GET'])
def index():
    return jsonify({"message": f"Welcome to the Video Generation API Working on project {current_project_id}"})
    
@app.route('/deleteAllData', methods=['GET'])
def delete_all_data():
    try:
        collection = db["Projects"]
        result = collection.delete_many({})
        if result.deleted_count > 0:
            return jsonify({"message": f"Successfully deleted {result.deleted_count} documents."}), 200
        else:
            return jsonify({"message": "No documents found to delete."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/generateVideo/Step1', methods=['POST' , 'GET'])
def generate_video_step1():
    # Video Information Generation
    collection = db["Projects"]
    try:
        prompt = "Mount Everest"
        duration = 60
        print(f"Received prompt: {prompt}")
        print(f"Received duration: {duration}")
        
        data = InfoGenerator.GenerateInfo(base_prompt=prompt, duration=duration)

        project_id = str(uuid.uuid4())
        creation_date = datetime.datetime.now().isoformat()
        title = data.get("Video Title")
        description = data.get("Video Description")
        duration = duration
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

@app.route('/generateVideo/Step2', methods=['GET'])
def generate_video_step2():
    # Video Media Generation
    print("Generating Media")
    try:
        project_id = current_project_id
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

@app.route('/generateVideo/Step3', methods=['GET'])
def generate_video_step3():
    print("Compiling Video")
    try:
        project_id = current_project_id
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

@app.route('/generateVideo/Step4', methods=['GET'])
def generate_video_step4():
    print("Giving Subtitles")

    project_id = current_project_id
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


