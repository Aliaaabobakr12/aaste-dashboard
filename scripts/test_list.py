
import urllib.request
import json

url = "https://abdelrahmangalhom-aaste.hf.space/analyze"
# Try TOP LEVEL LIST
payload = [{"id": "1", "review_text": "Good food"}]

try:
    print(f"Sending List Payload to {url}...")
    data = json.dumps(payload).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    
    req = urllib.request.Request(url, data=data, headers=headers, method='POST')
    with urllib.request.urlopen(req) as response:
        print("Success! Body:")
        resp_data = response.read().decode('utf-8')
        print(resp_data)
        
        # Save exact response
        with open('api_response.json', 'w', encoding='utf-8') as f:
            f.write(resp_data)
            
except urllib.error.HTTPError as e:
    print(f"Error {e.code}:")
    print(e.read().decode('utf-8'))
except Exception as e:
    print(f"Error: {e}")
