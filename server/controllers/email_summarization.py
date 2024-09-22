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

email_text = """
        Subject: need a logo for my new business
        Hi,
        My name is Sarah and I'm starting a new business. It's going to be a combination coffee shop and bookstore, cause I love books and coffee lol. Anyway, I need a logo for it and my cousin said you're really good at design stuff.
        I want something that looks professional but also kind of cozy and inviting, you know? Like maybe with a coffee cup and a book, but not too obvious. And I was thinking maybe we could use brown and green colors, but I'm not sure. What do you think?
        Oh, and the name of the shop is going to be "The Bookworm's Brew" ... or maybe "Chapters & Chai" ... actually I haven't really decided yet. Could you maybe come up with a few options for both names?
        I don't know how much this usually costs, but I'm just starting out so I can't spend too much. Is $50 enough? If not, let me know.
        I kind of need this pretty quick because I want to order some signage and business cards. Do you think you could have something for me to look at by the end of the week?
        Thanks so much!!!
        Sarah
        P.S. Do you also do website design? I might need help with that too but I'm not sure yet.
"""
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

input_data = {
    "email_content": email_text
}


llm_chain = prompt | watsonx_granite

op = llm_chain.invoke(input=input_data)
print(op)


@app.route('/request_summary', methods=['POST'])
def request_summary():
	data = request.json
	email_content = data.get('email_content')
	input_data = {
		"email_content": email_content
	}
	op = llm_chain.invoke(input=input_data)
	return {"summary": op}