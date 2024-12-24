
from flask import Flask, jsonify 
from Endpoints.VideoEditing import VideoEditing 
from Endpoints.MongoDB import MongoDb
from Endpoints.VideoGeneration import GenerateVideo
# from Endpoints.AuthBP import AuthBP

app = Flask(__name__)

app.register_blueprint(VideoEditing, url_prefix='/VideoEditing')
app.register_blueprint(MongoDb, url_prefix='/MongoDB')
app.register_blueprint(GenerateVideo, url_prefix='/VideoGeneration')
# app.register_blueprint(AuthBP, url_prefix='/Auth')

@app.route('/' , methods=['GET' , 'POST'])
def index():
    return jsonify({"message": f"Welcome to the Video Generation API"})


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
