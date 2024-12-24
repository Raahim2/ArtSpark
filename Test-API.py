import requests
import base64
import os
import dotenv
import time

dotenv.load_dotenv()

BASE_URL = "https://gentube.vercel.app"

def generate_thumbnail(project_id):
    apiUrl = f"{BASE_URL}/generateThumbnail"
    apiKey = os.getenv("GENTUBE_API_KEY")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
    }
    
    payload = {
        'project_id': project_id,
    }
    
    try:
        response = requests.post(apiUrl, headers=headers, json=payload)
        response_data = response.json()
        
        if response.status_code == 200:
            print("Thumbnail generated successfully:", response_data)
        else:
            print("Error generating thumbnail:", response_data.get("message"))
    except Exception as e:
        print("An error occurred:", str(e))

def generate_video_step1(prompt, duration=20):
    apiUrl = f"{BASE_URL}/generateVideo/Step1"
    apiKey = os.getenv("GENTUBE_API_KEY")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
    }
    
    payload = {
        'prompt': prompt,
        'duration': duration,
    }
    
    try:
        response = requests.post(apiUrl, headers=headers, json=payload)
        
        if response.status_code != 200:
            print("Error generating video information:", response.text)
            return None
        
        response_data = response.json()
        project_id = response_data.get("project_id")
        creation_date = response_data.get("creation_date")
        title = response_data.get("title")
        description = response_data.get("description")
        oneword = response_data.get("oneword")
        
        print(f"Video information generated successfully: Project ID: {project_id}, Title: {title}, Description: {description}, Duration: {duration}, OneWord: {oneword}")
        return response_data
        
    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
        return None

def upload_video_data(title, description, duration, oneword, created_at):
    apiUrl = f"{BASE_URL}/uploadData"
    apiKey = os.getenv("GENTUBE_API_KEY")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
    }
    
    payload = {
        'title': title,
        'description': description,
        'duration': duration,
        'oneword': oneword,
        'created_at': created_at,
    }
    
    try:
        response = requests.post(apiUrl, headers=headers, json=payload)
        
        if response.status_code != 200:
            print("Error uploading video data:", response.text)
            return None
        
        response_data = response.json()
        print("Video data uploaded successfully:", response_data)
        return response_data.get("project_id")
        
    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
        return None

def upload_image(base64_string):
    # This is a truncated example, use a valid base64 string for actual testing

    apiUrl = f"{BASE_URL}/uploadImage"
    apiKey = os.getenv("GENTUBE_API_KEY")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
    }
    
    payload = {
        'base64_image': base64_string,
    }
    
    try:
        response = requests.post(apiUrl, headers=headers, json=payload)
        
        if response.status_code != 200:
            print("Error uploading image:", response.text)
            return None
        
        response_data = response.json()
        print("Image uploaded successfully:", response_data)
        return response_data.get("thumbnail_url")
        
    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
        return None

def convert_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        base64_string = base64.b64encode(image_file.read()).decode('utf-8')
    return base64_string

def update_collection(project_id, key, value):
    apiUrl = f"{BASE_URL}/updateCollection"
    apiKey = os.getenv("GENTUBE_API_KEY")
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
    }
    
    payload = {
        'project_id': project_id,
        'key': key,
        'value': value,
    }
    
    try:
        response = requests.post(apiUrl, headers=headers, json=payload)
        
        if response.status_code != 200:
            print("Error updating collection:", response.text)
            return None
        
        response_data = response.json()
        print("Collection updated successfully:", response_data)
        return response_data
    
    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
        return None

def concat_videos(project_id):
    api_url = f"{BASE_URL}/concatVideos"
    api_key = os.getenv("GENTUBE_API_KEY")  # Ensure your environment variable is set or replace with your actual API key

    headers = {
        'Content-Type': 'application/json',
        'Authorization': api_key,
    }
    
    payload = {
        'project_id': project_id,

    }
    
    # Send a request to start the video concatenation process
    try:
        response = requests.post(api_url, headers=headers, json=payload)
        
        if response.status_code != 202:
            print("Error starting video concatenation:", response.text)
            return None
        
        # Extract task_id from the response
        response_data = response.json()
        task_id = response_data.get("task_id")
        print(f"Video processing started. Task ID: {task_id}")
        
        return task_id
    
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while starting video concatenation: {e}")
        return None

def check_task_status(task_id):
    api_url = f"{BASE_URL}/task_status/{task_id}"

    try:
        while True:
            response = requests.get(api_url)
            
            if response.status_code != 200:
                print(f"Error checking task status: {response.text}")
                return None
            
            response_data = response.json()
            status = response_data.get("status")
            video_url = response_data.get("url")
            
            print(f"Task Status: {status}")
            
            if status == "Completed":
                print(f"Video URL: {video_url}")
                return video_url
            elif status == "Processing":
                print("Video is still processing... Checking again in 10 seconds...")
                time.sleep(10)  # Wait for 10 seconds before checking again
            else:
                print("Error processing video.")
                return None
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while checking task status: {e}")
        return None

def delete_all_mongo_data():
    api_url = f"{BASE_URL}/MongoDB/deleteAllData"

    try:
        response = requests.post(api_url)
        
        if response.status_code != 200:
            print("Error deleting all data:", response.text)
            return None
        
        response_data = response.json()
        message = response_data.get("message")
        print(f"Delete All Data Response: {message}")
        
        return message

    except requests.exceptions.RequestException as e:
        print(f"An error occurred while deleting all data: {e}")
        return None


def test_get_projects(api_key):
    api_url = f"{BASE_URL}/MongoDB/GetProjects"
    headers = {
        "Authorization": api_key,
        "Content-Type": "application/json"
    }
    body = {
        "filter_key": "project_id",
        "filter_value": "bd51ddea-9e3f-4481-ba24-c57ca3942680"
    }  # Add any required fields the server expects


    try:
        response = requests.post(api_url, headers=headers, json=body)

        if response.status_code == 200:
            print("Response Status Code: 200")
            print(response.json())
            return response.json()  # Attempt to parse JSON if status is 200
        elif response.status_code == 400:
            return {"error": "Bad Request", "raw_response": response.text}
        elif response.status_code == 403:
            return {"error": "Forbidden", "raw_response": response.text}
        else:
            return {"error": f"Unexpected status code: {response.status_code}", "raw_response": response.text}
    except requests.exceptions.JSONDecodeError:
        return {"error": "Invalid JSON response", "raw_response": response.text}
    except Exception as e:
        return {"error": "Request failed", "message": str(e)}


def delete_all_cloud_data():
    import cloudinary
    import cloudinary.api

    cloudinary.config(
        cloud_name=os.environ.get("CLOUDINARY_CLOUD_NAME"),
        api_key=os.environ.get("CLOUDINARY_API_KEY"),
        api_secret=os.environ.get("CLOUDINARY_API_SECRET")
    )

    try:
        # Initialize variables for pagination
        next_cursor = None
        
        while True:
            # Fetch resources (files) from Cloudinary
            resources = cloudinary.api.resources(max_results=500, next_cursor=next_cursor)
            
            # Extract the public IDs of resources
            public_ids = [resource['public_id'] for resource in resources['resources']]
            
            if public_ids:
                # Delete resources
                cloudinary.api.delete_resources(public_ids)
                print(f"Deleted {len(public_ids)} files.")
            
            # Check if there are more resources to fetch
            next_cursor = resources.get('next_cursor')
            if not next_cursor:
                break  # Exit if no more resources
            
        print("All files deleted successfully.")
    except Exception as e:
        print(f"Error: {e}")

print(test_get_projects(os.getenv("GENTUBE_API_KEY")))