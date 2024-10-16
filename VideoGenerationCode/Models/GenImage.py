import requests
import os
from dotenv import load_dotenv

load_dotenv()

def generate_image(prompt , output_path):
    print(f"Prompt: {prompt}")
    API_URL = "https://api-inference.huggingface.co/models/XLabs-AI/flux-RealismLora"
    headers = {"Authorization": f"Bearer {os.getenv('HUGGING_FACE_API')}" }
    payload = {
        "inputs": prompt,
        "options": {
            "height": 720,  
            "width": 1280  
        }
    }
    response = requests.post(API_URL, headers=headers, json=payload)

    with open(output_path, "wb") as f:
        f.write(response.content)

    print(f"Image successfully downloaded and saved to {output_path}")
    return response.content

def download_image(image_url, save_path='img.png'):
    if not image_url:
        print("No image URL provided.")
        return
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(image_url, headers=headers)
    
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
        print(f"Image successfully downloaded and saved to {save_path}")
    else:
        print(f"Failed to retrieve image. Status code: {response.status_code}")

def get_pexels_images(query, num_image, target_aspect_ratio=16/9, tolerance=0.1):
    endpoint = 'https://api.pexels.com/v1/search'
    
    headers = {
        'Authorization': os.getenv("PEXELS_API_KEY"),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    params = {
        'query': query,
        'per_page': num_image
    }
    
    response = requests.get(endpoint, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        photos = data.get('photos', [])
        
        if photos:
            image_urls = []
            for photo in photos:
                width = photo.get('width')
                height = photo.get('height')
                
                if width and height:
                    aspect_ratio = width / height
                    if abs(aspect_ratio - target_aspect_ratio) < tolerance:
                        image_urls.append(photo['src']['original'])
            
            if image_urls:
                return image_urls
            else:
                print("No images with the specified aspect ratio found.")
                return []
        else:
            print("No images found.")
            return []
    else:
        print(f"Failed to retrieve images. Status code: {response.status_code}")
        return []

def get_pexels_videos(query, num_video, target_aspect_ratio=16/9, tolerance=0.1):
    endpoint = 'https://api.pexels.com/videos/search'
    
    headers = {
        'Authorization': os.getenv("PEXELS_API_KEY"),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537/36'
    }
    
    params = {
        'query': query,
        'per_page': num_video
    }
    
    response = requests.get(endpoint, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        videos = data.get('videos', [])
        
        if videos:
            video_urls = []
            for video in videos:
                width = video.get('video_files', [{}])[0].get('width')
                height = video.get('video_files', [{}])[0].get('height')
                
                if width and height:
                    aspect_ratio = width / height
                    if abs(aspect_ratio - target_aspect_ratio) < tolerance:
                        video_urls.append(video['video_files'][0]['link'])
            
            if video_urls:
                return video_urls
            else:
                print("No videos with the specified aspect ratio found.")
                return []
        else:
            print("No videos found.")
            return []
    else:
        print(f"Failed to retrieve videos. Status code: {response.status_code}")
        return []

def download_video(url, filename):

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, stream=True)
        response.raise_for_status()  # Check if the request was successful
        
        with open(filename, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        print(f"Video downloaded successfully: {filename}")
    except requests.exceptions.RequestException as e:
        print(f"Error downloading video: {e}")
