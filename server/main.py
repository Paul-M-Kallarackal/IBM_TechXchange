from flask import Flask,request
from flask_cors import CORS
import requests
from ibm.classification import URL, HEADERS, BODY

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/classify', methods=['POST'])
def classify():
    text = request.json['text']
    url = URL
    headers = HEADERS
    body = BODY.format(text=text)

    response = requests.post(
        url,
        headers=headers,
        json=body
    )

    if response.status_code != 200:
        return jsonify({"error": "Non-200 response: " + str(response.text)}), response.status_code

    data = response.json()
    return jsonify({"generated_text": data['results'][0]['generated_text']})

if __name__ == '__main__':
    app.run(debug=True)

