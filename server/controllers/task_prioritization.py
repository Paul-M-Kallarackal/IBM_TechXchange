import requests
from main import app
from flask import request, jsonify

import json
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from dotenv import load_dotenv
from ibm_watsonx_ai.foundation_models.utils.enums import ModelTypes
import os

from langchain_ibm import WatsonxLLM
from langchain.prompts import PromptTemplate

load_dotenv()
file_path = os.getenv('FILE_PATH')
project_id = os.getenv("PROJECT_ID")
credentials = {
  "url": os.getenv("API_URL"),
  "apikey": os.getenv("API_KEY"),
}
space_id = None
verify = False

client = APIClient(credentials)

text = """
    Subject: Help with social media stuff
    Dear sir/madam,
    I hope this email finds you in good spirits. My name is Robert Johnson and I am the owner of Johnson's Hardware, a family-owned business that has been serving our community for over 50 years. I am writing to you today because I find myself in need of assistance with what the young folks call "social media marketing".
    You see, my grandson Tommy (he's 14 now, can you believe it?) was telling me over Sunday dinner that we need to get with the times and start promoting our business on the Facebook and the Twitter and what have you. I must admit, I'm a bit out of my depth with all this newfangled technology, but I trust Tommy's judgement. He's always fiddling with that smartphone of his, so he must know a thing or two about this stuff.
    I was wondering if you could help us set up some of these social media accounts and maybe show us how to use them properly. I've heard that you can reach a lot of people through these platforms, and goodness knows we could use some more customers, what with that big box store that opened up on the edge of town last year.
    Now, I'm not entirely sure what all is involved in this social media business, but I was thinking maybe we could post pictures of some of our products? Or perhaps share some DIY tips? I remember my father always used to say that if you help people, they'll remember you when they need something. Do you think that would work on the internet too?
    As for the budget, well, I'm not too sure what the going rate is for this kind of work. We're a small business, you understand, so we can't afford to break the bank. But I believe in fair pay for fair work, so please let me know what you think would be reasonable.
    Oh, and one more thing - my wife Martha suggested we might need something called a "hashtag". Do you know anything about those?
    I look forward to hearing back from you at your earliest convenience. If you need to reach me, you can call the store during business hours (8am-6pm, Monday to Saturday), or send me an email. Tommy set up this email account for me, but I must admit I'm still getting the hang of it, so please be patient if I don't respond right away.
    Thank you kindly for your time and consideration.
    Yours sincerely, Robert Johnson Owner, Johnson's Hardware "If we don't have it, you don't need it!"
    P.S. Do you know how to make the emails stop going into that spam folder? It's awfully inconvenient.
"""

model_id = ModelTypes.GRANITE_13B_CHAT_V2
parameters = {
    GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
    GenParams.MIN_NEW_TOKENS: 1,
    GenParams.MAX_NEW_TOKENS: 1000,
    GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
}


watsonx_granite = WatsonxLLM(
    model_id=model_id.value,
    url=credentials.get("url"),
    apikey=credentials.get("apikey"),
    project_id=project_id,
    params=parameters
)




template = """
    Analyze the following email from a client requesting your freelancing services. Extract all tasks that need to be completed for this freelance project and assign a priority (High, Medium, or Low) to each task based on the urgency and importance conveyed in the email.
    Email content:
    {email_content}
    Instructions:
    1. Identify all tasks mentioned or implied in the email.
    2. Assign a priority (High, Medium, or Low) to each task based on the client's urgency and the task's importance to the overall project.
    3. Present the tasks in a JSON format.
    4. For each task, include:
    - A clear, concise description of the task
    - The assigned priority
    - A brief explanation for the priority assignment, if necessary
    Output the result in the following JSON format:
    {{
    "tasks": [
        {{
        "id": 1,
        "description": "Task description",
        "priority": "High/Medium/Low",
        "explanation": "Brief explanation for priority, if needed"
        }},
        ...
    ]
    }}
    Ensure that all aspects of the project are covered.
"""






prompt = PromptTemplate.from_template(template)

llm_chain = prompt | watsonx_granite



@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/classify_tasks', methods=['POST'])
def classify_tasks():
	data = request.json
	email_content = data.get('email_content')
	input_data = {
		"email_content": email_content
	}
	op = llm_chain.invoke(input=input_data)
	json_data_cleaned = op.split('```json')[1].strip().split('```')[0].strip()
	print(json_data_cleaned)
	data = json.loads(json_data_cleaned)
	return jsonify(data)