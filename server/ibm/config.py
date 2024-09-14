import json
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models.inference import ModelInference
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods
from dotenv import load_dotenv
import os

load_dotenv()
project_id = os.getenv("PROJECT_ID")
my_credentials = {
  "url": os.getenv("API_URL"),
  "apikey": os.getenv("API_KEY"),
}

space_id = None
verify = False

client = APIClient(my_credentials)

gen_parms = {
    GenParams.DECODING_METHOD: DecodingMethods.SAMPLE,
    GenParams.MAX_NEW_TOKENS: 100
}


code_model = ModelInference(
  model_id=client.foundation_models.TextModels.GRANITE_20B_CODE_INSTRUCT,
  credentials=my_credentials,
  params=gen_parms,
  project_id=project_id,
  space_id=space_id,
  verify=verify,
)
rag_model = ModelInference(
  model_id=client.foundation_models.TextModels.GRANITE_13B_CHAT_V2,
  credentials=my_credentials,
  params=gen_parms,
  project_id=project_id,
  space_id=space_id,
  verify=verify,
)
summary_model = ModelInference(
  model_id=client.foundation_models.TextModels.GRANITE_13B_INSTRUCT_V2,
  credentials=my_credentials,
  params=gen_parms,
  project_id=project_id,
  space_id=space_id,
  verify=verify,
)
generation_model = ModelInference(
  model_id=client.foundation_models.TextModels.GRANITE_20B_MULTILINGUAL,
  credentials=my_credentials,
  params=gen_parms,
  project_id=project_id,
  space_id=space_id,
  verify=verify,
)

prompt_txt = "I need a basic wordpress html site with a contact form. It should be about vegetables. I need it in 2 days. Construct the html code for me."
gen_parms_override = gen_parms = {
    GenParams.DECODING_METHOD: DecodingMethods.SAMPLE,
    GenParams.MAX_NEW_TOKENS: 200
}
print("Code generation:")
generated_response = summary_model.generate(prompt=prompt_txt, params=gen_parms_override)
print(json.dumps(generated_response, indent=2))