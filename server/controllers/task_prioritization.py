import requests
from main import app
from flask import request, jsonify
URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
HEADERS = {
	"Accept": "application/json",
	"Content-Type": "application/json",
	"Authorization": "Bearer eyJraWQiOiIyMDI0MDkwMjA4NDIiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02NjMwMDRPS1JHIiwiaWQiOiJJQk1pZC02NjMwMDRPS1JHIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiOTNhNTE4OGMtMGJkMC00ZjBjLTgxYjUtZWE5NGRiNTYyZDc3IiwiaWRlbnRpZmllciI6IjY2MzAwNE9LUkciLCJnaXZlbl9uYW1lIjoiUGF1bCIsImZhbWlseV9uYW1lIjoiTSBLYWxsYXJhY2thbCIsIm5hbWUiOiJQYXVsIE0gS2FsbGFyYWNrYWwiLCJlbWFpbCI6InBhdWxta2FsbGFyYWNrYWxAZ21haWwuY29tIiwic3ViIjoicGF1bG1rYWxsYXJhY2thbEBnbWFpbC5jb20iLCJhdXRobiI6eyJzdWIiOiJwYXVsbWthbGxhcmFja2FsQGdtYWlsLmNvbSIsImlhbV9pZCI6IklCTWlkLTY2MzAwNE9LUkciLCJuYW1lIjoiUGF1bCBNIEthbGxhcmFja2FsIiwiZ2l2ZW5fbmFtZSI6IlBhdWwiLCJmYW1pbHlfbmFtZSI6Ik0gS2FsbGFyYWNrYWwiLCJlbWFpbCI6InBhdWxta2FsbGFyYWNrYWxAZ21haWwuY29tIn0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6Ijk3YTkzM2QxYzcwMzRhMWFhZGFiZDdkODVlMDE0OGY3IiwiaW1zX3VzZXJfaWQiOiIxMjY4OTA1MyIsImZyb3plbiI6dHJ1ZSwiaW1zIjoiMjgxODQ1MyJ9LCJpYXQiOjE3MjY5MzU3MjEsImV4cCI6MTcyNjkzOTMyMSwiaXNzIjoiaHR0cHM6Ly9pYW0uY2xvdWQuaWJtLmNvbS9pZGVudGl0eSIsImdyYW50X3R5cGUiOiJ1cm46aWJtOnBhcmFtczpvYXV0aDpncmFudC10eXBlOmFwaWtleSIsInNjb3BlIjoiaWJtIG9wZW5pZCIsImNsaWVudF9pZCI6ImRlZmF1bHQiLCJhY3IiOjEsImFtciI6WyJwd2QiXX0.Jb6uK-ykYw6vc3yrTlp6Gh1DoHeyCiDCgMGpCWFjlhOSQdl4Y3NhmpLgn1Y30iPTMFzeTDYWQ1U2n5d0PeSfYbH959bT8VZtmTFjqSUhqdyuc4RMXFDrtrgYR4vy-8i9g9o-a91_jl4Me0urh3X64kwepsCRqeb5cPsXE69-eN1YHUpbnYA2trOdW5a1uJAnQCBkGIrS7r3KrmCv-PWNgYnj-TPiTb2CbT0i5gNXDo1c1tciTvKNEEggIMhr_5GqEZMq8Q3HCBsTNeLlHLJjhoRhLvSMyd8VX5quaMuPBXIiYFpdseVG7mIXpJe-lE5XUv3jBp7o8qMS1977NQCq9w"
}

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/classify_priority', methods=['POST'])
def classify():
    # text = request.json['text']
    print(request.json)
    return jsonify({"error": "Not implemented"}), 501
    url = URL
    headers = HEADERS
    body =  {
	"input": f"""Given the following web development task, categorize them into 4 priority levels: 1. Urgent (tasks that must be completed within 24 hours), 2. High (important tasks with a tight deadline but not urgent), 3. Medium (tasks that are essential but can wait a few days), and 4. Low (tasks with no immediate impact and can be done later). Return the priority alone.

Input: Fix broken links on client'\''s homepage.
Output: Urgent

Input: Create a wireframe for a new client project due in 3 days.
Output: High

Input: Respond to a client'\''s query about design changes.
Output: Medium

Input: Update portfolio website with recent projects.
Output: Low

Input: Deploy a security patch on client'\''s e-commerce site.
Output: Urgent

Input: Schedule a meeting to discuss potential project details.
Output: Medium

Input: Optimize website images for faster loading times.
Output: High

Input: Review and refactor code for SEO improvement.
Output: Low

Input: Set up a payment gateway for a new client'\''s site, deadline tomorrow.
Output: Urgent

Input: Add social media icons to client'\''s footer.
Output: Low

Input: {text}.
Output:""",
	"parameters": {
		"decoding_method": "greedy",
		"max_new_tokens": 200,
		"stop_sequences": ["Medium","Low","High","Urgent"],
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

    response = requests.post(
        url,
        headers=headers,
        json=body
    )

    if response.status_code != 200:
        return jsonify({"error": "Non-200 response: " + str(response.text)}), response.status_code

    data = response.json()
    return jsonify({"generated_text": data['results'][0]['generated_text']})

