from flask import Flask
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/summary')
def summary():
    url = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"

    body = {
        "input": """Summarize the given text into clear formatted points. Generate a priority level for each of these requests

    Input: I need a WordPress website for my new bakery. It should have a home page showcasing our best sellers, an about us page, a menu page with all our items categorized, and a contact page with a form and our location on a map. Can you help?
    Output: Bakery website with 4 pages: home (best sellers), about us, menu (categorized), and contact (form + map). WordPress-based.

    Input: Looking for a WordPress developer to create a portfolio website for my photography business. I want a minimalist design with a gallery feature, blog section, and integration with Instagram. The site should be mobile-responsive and optimized for fast loading of high-resolution images
    Output: Minimalist photography portfolio. WordPress, gallery feature, blog, Instagram integration. Mobile-responsive, optimized for fast image loading

    Input: We need a WordPress site for our local gym. Features should include a class schedule that members can book online, a blog for fitness tips, a members-only area, and integration with our existing payment system for membership fees. The design should be energetic and motivating.
    Output:""",
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 200,
            "stop_sequences": ["."],
            "repetition_penalty": 1
        },
        "model_id": "ibm/granite-13b-chat-v2",
        "project_id": "edc9fc6f-1044-4906-ba76-c3e861fd82ff",
        "moderations": {
            "hap": {
                "input": {
                    "enabled": True,
                    "threshold": 0.5,
                    "mask": {
                        "remove_entity_value": True
                    }
                },
                "output": {
                    "enabled": True,
                    "threshold": 0.5,
                    "mask": {
                        "remove_entity_value": True
                    }
                }
            }
        }
    }
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer BEARER_TOKEN"
    }
    response = requests.post(
        url,
        headers=headers,
        json=body
    )
    data = response.json()
    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))
    print(data)


if __name__ == '__main__':
    app.run(debug=True) 