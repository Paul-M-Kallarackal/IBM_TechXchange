from main import app
from flask import request, jsonify

@app.route('/generate_acceptance_response', methods=['POST'])
def generate_acceptance_response():
    return jsonify({"error": "Not implemented"}), 501

@app.route('/generate_rejection_response', methods=['POST'])
def generate_rejection_response():
    return jsonify({"error": "Not implemented"}), 501

@app.route('/generate_negotiation_response', methods=['POST'])
def generate_negotiation_response():
    return jsonify({"error": "Not implemented"}), 501