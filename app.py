from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import time
import random

app = Flask(__name__, static_folder='static', template_folder='templates')

# Simple upload folder
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save file temporarily
    filename = f"upload_{int(time.time())}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    # Simulate AI processing (remove when you have real model)
    time.sleep(2.5)
    
    # Mock prediction (replace with actual model later)
    has_tumor = random.random() > 0.5  # 50% chance
    confidence = round(random.uniform(85.0, 98.0), 2)
    
    result = {
        'has_tumor': has_tumor,
        'confidence': confidence,
        'tumor_probability': round(confidence if has_tumor else 100 - confidence, 2),
        'no_tumor_probability': round(100 - confidence if has_tumor else confidence, 2),
        'processing_time': round(random.uniform(1.8, 3.2), 2),
        'image_path': f'/static/uploads/{filename}',
        'message': 'Tumor Detected' if has_tumor else 'No Tumor Detected'
    }
    
    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)