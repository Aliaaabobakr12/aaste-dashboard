
import urllib.request
import json
import sys

url = "https://abdelrahmangalhom-aaste.hf.space/analyze"

payloads = [
    {"reviews": [{"id": "1", "review_text": "Good food"}]}, # My original plan
    [{"id": "1", "review_text": "Good food"}],             # List directly
    {"text": "Good food"},                                  # Simple text
    {"inputs": "Good food"}                                 # HF default
]

for i, payload in enumerate(payloads):
    print(f"\n--- Attempt {i+1} ---")
    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    
    try:
        req = urllib.request.Request(url, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            print("SUCCESS!")
            print(response.read().decode('utf-8'))
            sys.exit(0) # Exit on first success
            
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}")
        body = e.read().decode('utf-8')
        try:
            err_json = json.loads(body)
            # Print specifically the 'detail' validation error
            if 'detail' in err_json:
                print("Validation Error Detail:")
                print(json.dumps(err_json['detail'], indent=2))
            else:
                print(body)
        except:
            print(body)
