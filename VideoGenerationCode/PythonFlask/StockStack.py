import requests
import os

API_KEY = os.getenv("SHOTSTACK_API_KEY")

headers = {
    "x-api-key": f"{API_KEY}",
    "Content-Type": "application/json"
}

payload = {
  "timeline": {
    "tracks": [
      {
        "clips": [
          {
            "asset": {
              "type": "text",
              "text": "Welcome to Shotstack",
              "font": {
                "family": "Clear Sans",
                "color": "#ffffff",
                "size": 46
              },
              "alignment": {
                "horizontal": "left"
              },
              "width": 566,
              "height": 70
            },
            "start": 4,
            "length": "end",
            "transition": {
              "in": "fade",
              "out": "fade"
            },
            "offset": {
              "x": -0.15,
              "y": 0
            },
            "effect": "zoomIn"
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "video",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/footage/earth.mp4",
              "trim": 5,
              "volume": 1
            },
            "start": 0,
            "length": "auto",
            "transition": {
              "in": "fade",
              "out": "fade"
            }
          }
        ]
      },
      {
        "clips": [
          {
            "asset": {
              "type": "audio",
              "src": "https://shotstack-assets.s3-ap-southeast-2.amazonaws.com/music/freepd/motions.mp3",
              "effect": "fadeOut",
              "volume": 1
            },
            "start": 0,
            "length": "end"
          }
        ]
      }
    ]
  },
  "output": {
    "format": "mp4",
    "size": {
      "width": 1280,
      "height": 720
    }
  }
}



r = requests.post("https://api.shotstack.io/edit/v1/render", headers=headers, json=payload)

response = r.json()


if response.get('success'):
    render_id = response['response']['id']
    secure_url = f"https://api.shotstack.io/edit/v1/render/{render_id}"
    print(f"Secure Video URL: {secure_url}")

    # Download the video
    video_response = requests.get(secure_url, headers=headers)
    video_data = video_response.json()
    print(video_data)
    video_url = video_data['response']['url']
    video_download_response = requests.get(video_url, headers=headers)
    
    if video_download_response.status_code == 200:
        with open("downloaded_video.mp4", "wb") as video_file:
            video_file.write(video_download_response.content)
        print("Video downloaded successfully.")
    else:
        print("Failed to download the video.")
else:
    print("Failed to queue render")


# ------------------

# video_url = "https://api.shotstack.io/edit/v1/render/e5773a23-2e0a-48a5-ae9e-01066bccffca"

# video_response = requests.get(video_url, headers=headers)
# print(video_response.content)
# if video_response.status_code == 200:
#     with open("downloaded_video.mp4", "wb") as video_file:
#         video_file.write(video_response.content)
#     print("Video downloaded successfully.")
# else:
#     print("Failed to download the video.")

