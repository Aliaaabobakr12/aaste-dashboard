
import os
import json
import glob

processed_dir = 'data/processed'
files = glob.glob(os.path.join(processed_dir, '*.json'))
if not files:
    print("No processed files found.")
    exit(1)

# Get latest file
latest_file = max(files, key=os.path.getctime)
print(f"Reading latest file: {latest_file}")

with open(latest_file, 'r', encoding='utf-8') as f:
    data = json.load(f)
    print(json.dumps(data, indent=2, ensure_ascii=False))
