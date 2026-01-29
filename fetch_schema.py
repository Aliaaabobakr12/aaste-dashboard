
import urllib.request
import json

url = "https://abdelrahmangalhom-aaste.hf.space/openapi.json"

try:
    with urllib.request.urlopen(url) as response:
        data = json.load(response)
        
        # Get request body ref
        try:
            req_body_ref = data['paths']['/analyze']['post']['requestBody']['content']['application/json']['schema']['$ref']
            schema_name = req_body_ref.split('/')[-1]
            schema = data['components']['schemas'][schema_name]
            
            print(f"Input Schema ({schema_name}):")
            print(json.dumps(schema, indent=2))
        except KeyError as e:
            print(f"Could not find schema reference: {e}")
            print("Dump of path:")
            print(json.dumps(data['paths']['/analyze'], indent=2))

except Exception as e:
    print(f"Error: {e}")
