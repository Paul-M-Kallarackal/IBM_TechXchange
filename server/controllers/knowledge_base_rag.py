from main import app
from flask import request, jsonify
import os
import json
from git import Repo, GitCommandError
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter, Language
from langchain_community.document_loaders import PyPDFLoader
from langchain_ibm import WatsonxEmbeddings, WatsonxLLM
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai.foundation_models.utils import get_embedding_model_specs
from ibm_watsonx_ai.foundation_models.inference import ModelInference
from ibm_watsonx_ai.foundation_models.utils.enums import DecodingMethods, EmbeddingTypes, ModelTypes
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from langchain_community.vectorstores import Chroma
from pinecone import Pinecone,ServerlessSpec
from langchain_pinecone import PineconeVectorStore


# Load environment variables
load_dotenv()
os.environ['PINECONE_API_KEY'] = os.getenv("PINECONE_API_KEY")
project_id = os.getenv("PROJECT_ID")
credentials = {
    "url": os.getenv("API_URL"),
    "apikey": os.getenv("API_KEY"),
}
pc = Pinecone()
EXTENSION_TO_LANGUAGE = {
    ".py": Language.PYTHON, ".java": Language.JAVA, ".js": Language.JS,
    ".cpp": Language.CPP, ".c": Language.C, ".ts": Language.TS,
    ".html": Language.HTML, ".go": Language.GO, ".md": Language.MARKDOWN,
}


def clone_repo(clone_url, clone_dir):
    try:
        Repo.clone_from(clone_url, clone_dir)
        print(f"Repository cloned into {clone_dir}")
    except GitCommandError as e:
        print(f"Error cloning repository: {e}")

def detect_language(file_path):
    _, ext = os.path.splitext(file_path)
    return EXTENSION_TO_LANGUAGE.get(ext, None)

# Read file with multiple encodings
def read_file_with_encoding(file_path, encodings=['utf-8', 'latin-1', 'iso-8859-1']):
    for encoding in encodings:
        try:
            with open(file_path, 'r', encoding=encoding) as f:
                return f.read()
        except UnicodeDecodeError:
            #print(f"Failed to read {file_path} with encoding {encoding}, trying next...")
            return None
    raise UnicodeDecodeError(f"Unable to decode file {file_path} with given encodings")

# Process a single file and split it into chunks
def process_file(file_path):
    try:
        file_content = read_file_with_encoding(file_path)
    except UnicodeDecodeError as e:
        #print(f"Skipping file {file_path} due to encoding error: {e}")
        return None

    language = detect_language(file_path)
    if language is None:
        #print(f"Skipping unsupported file: {file_path}")
        return None

    splitter = RecursiveCharacterTextSplitter.from_language(language=language, chunk_size=100, chunk_overlap=20)
    return splitter.create_documents([file_content])

# Process all files in a repository
def process_repository(repo_path):
    all_docs = []
    for root, dirs, files in os.walk(repo_path):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            file_docs = process_file(file_path)
            if file_docs:
                all_docs.extend(file_docs)
    return all_docs



@app.route('/ask_code', methods=['POST'])
def get_answer():
    clone_dir = os.getenv("CODE_EXAMPLES")+request.json.get('name')
    query = request.json.get('query') + ' Get it from the README file or Repository if present'
    # clone_url = 'URL TO CLONE'
    # clone_repo(clone_url, clone_dir)  # Assuming repository is cloned here
    docs = process_repository(clone_dir)
    model_id = ModelTypes.GRANITE_13B_CHAT_V2
    parameters = {
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.MIN_NEW_TOKENS: 1,
        GenParams.MAX_NEW_TOKENS: 1000,
        GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
    }
    index_name = "codeindex"
    get_embedding_model_specs(credentials.get('url'))
    embeddings = WatsonxEmbeddings(
        model_id=EmbeddingTypes.IBM_SLATE_30M_ENG.value,
        url=credentials["url"],
        apikey=credentials["apikey"],
        project_id=project_id
    )
    pinecone = PineconeVectorStore.from_documents(
    docs, embedding=embeddings, index_name=index_name
)
    # Initialize Watsonx LLM
    watsonx_granite = WatsonxLLM(
        model_id=model_id.value,
        url=credentials.get("url"),
        apikey=credentials.get("apikey"),
        project_id=project_id,
        params=parameters
    )
    print(docs, embeddings)
    qa = RetrievalQA.from_chain_type(llm=watsonx_granite, chain_type="stuff", retriever=pinecone.as_retriever())
    answer = qa.invoke(query)
    return jsonify(answer)

@app.route('/ask_pdf', methods=['POST'])
def get_answer_pdf():
    print(request.json.get('name'))
    print(request.json)
    file_path = os.getenv("PDF_EXAMPLES")+request.json.get('name')
    query = request.json.get('query')
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=100, length_function=len)
    index_name = "pdfindex"
    model_id = ModelTypes.GRANITE_13B_CHAT_V2
    parameters = {
        GenParams.DECODING_METHOD: DecodingMethods.GREEDY,
        GenParams.MIN_NEW_TOKENS: 1,
        GenParams.MAX_NEW_TOKENS: 1000,
        GenParams.STOP_SEQUENCES: ["<|endoftext|>"]
    }
    get_embedding_model_specs(credentials.get('url'))
    embeddings = WatsonxEmbeddings(
        model_id=EmbeddingTypes.IBM_SLATE_30M_ENG.value,
        url=credentials["url"],
        apikey=credentials["apikey"],
        project_id=project_id
    )
    # Initialize Watsonx LLM
    watsonx_granite = WatsonxLLM(
        model_id=model_id.value,
        url=credentials.get("url"),
        apikey=credentials.get("apikey"),
        project_id=project_id,
        params=parameters
    )
    docs = text_splitter.split_documents(documents)

    pinecone = PineconeVectorStore.from_documents(
        docs, embedding=embeddings, index_name=index_name
    )
    qa = RetrievalQA.from_chain_type(llm=watsonx_granite, chain_type="stuff", retriever=pinecone.as_retriever())
    answer = qa.invoke(query)
    return jsonify(answer)