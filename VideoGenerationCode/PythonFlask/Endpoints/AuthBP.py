import os
import base64
import random
import pickle
from flask import jsonify, Blueprint, request
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from pymongo import MongoClient

# The SCOPES required to send an email using Gmail API
SCOPES = ['https://www.googleapis.com/auth/gmail.send']
AuthBP = Blueprint('AuthBP', __name__)

# Environment variables for client credentials and MongoDB
CLIENT_ID = os.getenv("WEB_CLIENT_ID")
CLIENT_SECRET = os.getenv("WEB_CLIENT_SECRET")
MONGO_URI = os.getenv("MONGO_URI")
GENTUBE_API_KEY = os.getenv("GENTUBE_API_KEY")

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client["GenTube"]
credentials_collection = db["credentials"]


def get_gmail_service():
    """Authenticate and return the Gmail API service."""
    creds = None
    
    # Retrieve credentials from MongoDB
    stored_creds = credentials_collection.find_one({"_id": "user_credentials"})
    if stored_creds:
        creds = pickle.loads(stored_creds["creds"])

    # If there are no (valid) credentials, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Use InstalledAppFlow to initialize from environment variables
            flow = InstalledAppFlow.from_client_config(
                {
                    "installed": {
                        "client_id": CLIENT_ID,
                        "client_secret": CLIENT_SECRET,
                        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                        "token_uri": "https://oauth2.googleapis.com/token",
                    }
                },
                SCOPES
            )
            # Start the local server for OAuth
            creds = flow.run_local_server(port=5000)

        # Save the credentials in MongoDB
        credentials_collection.update_one(
            {"_id": "user_credentials"},
            {"$set": {"creds": pickle.dumps(creds)}},
            upsert=True
        )

    # Build the Gmail API service
    service = build('gmail', 'v1', credentials=creds)
    return service


def create_message(sender, to, subject, body):
    """Create a message to send an email."""
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    msg = MIMEText(body, 'html')  # Set MIME type to HTML for styled content
    message.attach(msg)
    
    # Convert message to raw format
    raw_message = message.as_string()

    # Base64 encode the raw message (URL safe)
    raw_message_b64 = base64.urlsafe_b64encode(raw_message.encode('UTF-8')).decode('UTF-8')
    
    return {'raw': raw_message_b64}


@AuthBP.route('/send_otp_email', methods=['POST' , 'GET'])
def send_otp_email():
    """Route to send an OTP email."""
    try:
        # Generate OTP (4 digits)
        otp = random.randint(1000, 9999)

        # Get Gmail service
        service = get_gmail_service()
        
        sender = os.getenv("FLASK_MAIL")  # Your email address from the environment variable
        # to = request.json.get('email')  # Get the recipient email address from the request body
        to = os.getenv("FLASK_MAIL")
        subject = "Your OTP Code"
        
        # Create a stylish HTML email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f0f0f0; padding: 20px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h1 style="color: #333;">Your GenTube OTP Code</h1>
                <h2 style="color: #007BFF;">{otp}</h2>
                <p style="color: #555;">Use this code to verify your email address. The code will expire in 10 minutes.</p>
                <div style="margin-top: 20px; font-size: 14px; color: #777;">
                    <p>If you did not request this code, please ignore this email.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Create the message with the OTP
        message = create_message(sender, to, subject, body)
        
        # Send the message
        send_message = service.users().messages().send(userId="me", body=message).execute()

        return jsonify({"status": "success", "message": "OTP email sent successfully!"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500



# @AuthBP.route('/login', methods=['GET'])
# def login():
#     """Route to log in using Google OAuth 2.0."""
#     try:
#         # Use InstalledAppFlow with environment variables
#         flow = InstalledAppFlow.from_client_config(
#             {
#                 "installed": {
#                     "client_id": CLIENT_ID,
#                     "client_secret": CLIENT_SECRET,
#                     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#                     "token_uri": "https://oauth2.googleapis.com/token",
#                 }
#             },
#             SCOPES
#         )

#         # Start the local server for OAuth
#         creds = flow.run_local_server(port=5000)

#         # Save credentials to MongoDB
#         credentials_collection.update_one(
#             {"_id": "user_credentials"},
#             {"$set": {"creds": pickle.dumps(creds)}},
#             upsert=True
#         )

#         return jsonify({"status": "success", "message": "Login successful!"}), 200
#     except Exception as e:
#         return jsonify({"status": "error", "message": str(e)}), 500
