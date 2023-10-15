from flask import Flask, request
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
import openai
from uuid import uuid4 as v4

load_dotenv()

openai.api_key = os.getenv("OPENAI_KEY")

app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/", methods=["GET", "POST"])
@cross_origin()
def main():
    if request.method == 'POST':
        return '{"message": "embedded %s"}' % request.json['url']
            

    return '{"message": "Hello world"}'

@app.post("/fill-chart")
@cross_origin()
def fill_chart():
    chart_items = []

    transcript = request.json['transcript']

    completion = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=[
        {"role": "system", "content": "act as an expert emergency room doctor"},
        {"role": "user", "content": f"based on the following conversation transcript find the patients chief complaint, just output the main complaint and nothing more: {transcript}"}
    ])

    chart_items.append({'name': "Cheif Complaint", "content": completion['choices'][0]['message']['content']})

    print(completion)

    return { 'chart_items': chart_items }

    # return "hello world"

@app.post("/transcribe")
@cross_origin()
def transcribe():
    print(request.files['audio'])
    audio_id = v4()
    request.files['audio'].save(f'./audiofiles/{audio_id}.mp3')
    with open(f'./audiofiles/{audio_id}.mp3', "rb") as audio_file:
        transcript = openai.Audio.transcribe("whisper-1", audio_file)
        
        print(transcript)
        return transcript
