from main import app
from flask import request, jsonify

@app.route('/upload_file', methods=['POST'])
def upload_file():
    return jsonify({"error": "Not implemented"}), 501

@app.route('/get_info', methods=['POST'])
def get_info():
    return jsonify({"error": "Not implemented"}), 501