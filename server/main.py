from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
from controllers.email_summarization import *
from controllers.knowledge_base_rag import *
from controllers.task_prioritization import *
from controllers.response_generation import *

if __name__ == '__main__':
    app.run(debug=True)

