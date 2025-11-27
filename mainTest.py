import cv2
from keras.models import load_model
from PIL import Image
import numpy as np

model = load_model('BrainTumor10EpochsCategorical.h5')

# Read the image using OpenCV
image = cv2.imread('C:\\Users\\praj2\\Desktop\\projects\\brain tumor\\pred\\pred5.jpg')

# Convert the OpenCV image to a PIL image
img = Image.fromarray(image)

# Resize the image to (64, 64)
img = img.resize((64, 64))

# Convert the PIL image to a numpy array
img = np.array(img)

print(img)

# Add a batch dimension to the image and normalize pixel values
img = np.expand_dims(img, axis=0)  # Shape: (1, 64, 64, 3)
img = img / 255.0  # Normalize pixel values

# Use model.predict() and np.argmax() instead of predict_classes()
result = np.argmax(model.predict(img), axis=1)
print(result)
