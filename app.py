from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

# Configure upload folder
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Your prediction logic here
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'})
    
    # Save the file
    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(file_path)
    
    # Process the image (call your ML model)
    # result = your_model_function(file_path)
    
    # For demo, return a simulated result
    import random
    result = "Brain Tumor Detected" if random.random() > 0.5 else "No Brain Tumor Detected"
    
    return jsonify({'result': result, 'confidence': round(random.random() * 20 + 80, 1)})

if __name__ == '__main__':
    app.run(debug=True)