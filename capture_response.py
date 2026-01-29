
import urllib.request
import json
import sys

url = "https://abdelrahmangalhom-aaste.hf.space/analyze"
# Use the EXACT payload that worked in verify_api.py
payload = {"reviews": [{"id": "1", "review_text": "Good food"}]}

try:
    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as response:
        resp_data = response.read().decode('utf-8')
        print("Success! Body:")
        print(resp_data) 
        
        # Try to parse
        try:
            json_obj = json.loads(resp_data)
            with open('api_response.json', 'w', encoding='utf-8') as f:
                json.dump(json_obj, f, indent=2, ensure_ascii=False)
            print("Saved to api_response.json")
        except:
            print("Could not parse JSON, saved raw text to api_response.txt")
            with open('api_response.txt', 'w', encoding='utf-8') as f:
                f.write(resp_data)
            
except urllib.error.HTTPError as e:
    print(f"Error {e.code}:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
