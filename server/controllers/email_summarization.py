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

model_id = ModelTypes.GRANITE_13B_INSTRUCT_V2
parameters = {
    GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
    GenParams.MIN_NEW_TOKENS: 1,
    GenParams.MAX_NEW_TOKENS: 4096,
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
    You are an AI assistant tasked with summarizing a client email sent to a freelancer. 
    Please extract the key requirements from the email [List of actionable items].
	Do not hallucinate or add any information that is not present in the email.:
    {email_content}
	[List of work items]:
"""




prompt = PromptTemplate.from_template(template)

llm_chain = prompt | watsonx_granite



@app.route('/request_summary', methods=['POST'])
def request_summary():
	data = request.json
	email_content = data.get('email_content')
	input_data = {
		"email_content": email_content
	}
	op = llm_chain.invoke(input=input_data)
	return {"summary": op}