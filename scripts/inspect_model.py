
import pickle
import sys

try:
    with open('egyptian_combined_3D_weightTrue_best.pkl', 'rb') as f:
        data = pickle.load(f)
    print(f"Successfully loaded pickle.")
    print(f"Type: {type(data)}")
    print(f"Content: {data}")
except Exception as e:
    print(f"Error loading pickle: {e}")
