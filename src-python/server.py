from flask import Flask, request, jsonify
from functions import ExtractFeatures
from flask_cors import CORS
import logging
import sys

app = Flask(__name__)
CORS(app)  # Allow requests from localhost:3000

app.logger.setLevel(logging.INFO)


@app.route('/')
def hello_world():
    app.logger.info('Hello World!')
    print('Hello World!', file=sys.stderr)
    return 'Hello, World!'

@app.route('/process')
def hello():
    
    return 'Hello, process!'

@app.route('/process', methods=['POST'])
def process_route():
    app.logger.info('Hello p!')
    data = request.get_json()
    time_values = data.get('time_values')
    tr_values = data.get('tr_values')

    if time_values is None or tr_values is None:
        return jsonify({"error": "Missing time_values or tr_values"}), 400

    if len(time_values) != len(tr_values):
        return jsonify({"error": "time_values and tr_values must be of the same length"}), 400

    app.logger.info('Hello p!')
    results = ExtractFeatures(time_values, tr_values)
    return jsonify("Success")

if __name__ == '__main__':
    app.run(debug=True)