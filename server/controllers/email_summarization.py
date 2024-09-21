from main import app
from flask import request, jsonify

@app.route('/summarize_email', methods=['POST'])
def summarize_email():
    return jsonify({"error": "Not implemented"}), 501
