import requests
import os
import dotenv
import os

dotenv.load_dotenv()

def Gemini(prompt):
    # Set up the API endpoint and your API key
    API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
    API_KEY = os.getenv("GEMINI_API_KEY")  # Replace with your actual API key

    # Set up headers
    headers = {
        "Content-Type": "application/json"
    }

    # Create the payload according to the curl command structure
    data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    # Make the POST request to the API
    response = requests.post(f"{API_ENDPOINT}?key={API_KEY}", headers=headers, json=data)

    # Check for successful response
    if response.status_code == 200:
        result = response.json()
        # Extract the text part from the response
        output_text = result['candidates'][0]['content']['parts'][0]['text']
        return output_text
    else:
        return f"Error: {response.status_code} - {response.text}"
