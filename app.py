from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import cv2
import time

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Load model (adjust filename as needed)
MODEL_PATH = 'BrainTumor10EpochsCategorical.h5'  # Update with your actual model filename
model = load_model(MODEL_PATH)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess_image(img_path):
    """Preprocess image for model prediction"""
    img = image.load_img(img_path, target_size=(224, 224))  # Adjust size based on your model
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize
    return img_array

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
    
    if file and allowed_file(file.filename):
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Start timer
        start_time = time.time()
        
        try:
            # Preprocess and predict
            processed_img = preprocess_image(filepath)
            predictions = model.predict(processed_img)
            
            # Calculate processing time
            processing_time = round(time.time() - start_time, 2)
            
            # Interpret results (adjust based on your model output)
            # Example for binary classification
            if predictions.shape[1] == 2:  # Binary classification
                tumor_prob = predictions[0][1] * 100
                no_tumor_prob = predictions[0][0] * 100
                
                has_tumor = tumor_prob > 50
                confidence = max(tumor_prob, no_tumor_prob)
                
                result = {
                    'has_tumor': bool(has_tumor),
                    'confidence': round(float(confidence), 2),
                    'tumor_probability': round(float(tumor_prob), 2),
                    'no_tumor_probability': round(float(no_tumor_prob), 2),
                    'processing_time': processing_time,
                    'image_path': f'/static/uploads/{filename}',
                    'message': 'Tumor Detected' if has_tumor else 'No Tumor Detected'
                }
            else:
                # Multi-class classification
                class_idx = np.argmax(predictions[0])
                confidence = predictions[0][class_idx] * 100
                
                # Define your classes
                classes = ['Glioma', 'Meningioma', 'Pituitary', 'No Tumor']  # Update based on your model
                
                result = {
                    'tumor_type': classes[class_idx],
                    'confidence': round(float(confidence), 2),
                    'all_predictions': predictions[0].tolist(),
                    'processing_time': processing_time,
                    'image_path': f'/static/uploads/{filename}',
                    'message': f'Detected: {classes[class_idx]}'
                }
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Use PNG, JPG, or JPEG'}), 400

@app.route('/static/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Create uploads directory if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)