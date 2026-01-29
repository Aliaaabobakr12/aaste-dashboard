
import urllib.request
import json
import uuid
import os

# Configuration
BASE_URL = "http://localhost:3000/api"
UPLOAD_URL = f"{BASE_URL}/upload"
PROCESS_URL = f"{BASE_URL}/process"
TEST_FILE = "test_upload.json"

# Create test file
reviews = [
    {"review_text": "The soup was tasty but cold.", "star_rating": "3", "title": "Soup"},
    {"review_text": "Excellent service and great atmosphere!", "star_rating": "5", "title": "Great"}
]
with open(TEST_FILE, 'w') as f:
    json.dump(reviews, f)

try:
    # 1. Upload
    print(f"Uploading {TEST_FILE} to {UPLOAD_URL}...")
    
    # Simple multipart upload is hard with urllib standard lib.
    # We'll use a boundary.
    boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
    data = []
    data.append(f'--{boundary}')
    data.append(f'Content-Disposition: form-data; name="file"; filename="{TEST_FILE}"')
    data.append('Content-Type: application/json')
    data.append('')
    data.append(json.dumps(reviews))
    data.append(f'--{boundary}--')
    data.append('')
    body = "\r\n".join(data).encode('utf-8')
    
    headers = {'Content-Type': f'multipart/form-data; boundary={boundary}'}
    
    req = urllib.request.Request(UPLOAD_URL, data=body, headers=headers, method='POST')
    
    jobId = None
    with urllib.request.urlopen(req) as response:
        resp_json = json.load(response)
        print("Upload Response:", resp_json)
        jobId = resp_json.get('jobId')

    if not jobId:
        print("Failed to get Job ID")
        exit(1)

    print(f"Job ID: {jobId}")

    # 2. Process
    print(f"Triggering processing at {PROCESS_URL}...")
    proc_payload = {"jobId": jobId}
    proc_data = json.dumps(proc_payload).encode('utf-8')
    proc_headers = {'Content-Type': 'application/json'}
    
    proc_req = urllib.request.Request(PROCESS_URL, data=proc_data, headers=proc_headers, method='POST')
    
    with urllib.request.urlopen(proc_req) as response:
        proc_resp = json.load(response)
        print("Process Response:")
        print(json.dumps(proc_resp, indent=2))
        
        if proc_resp.get('message') == 'Processing completed successfully':
            print("INTEGRATION SUCCESS!")
        else:
            print("Processing did not report success.")

except urllib.error.HTTPError as e:
    print(f"HTTP Error {e.code}")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
