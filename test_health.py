import requests

try:
    r = requests.get("http://localhost:8000/api/health")
    print(r.status_code)
    print(r.json())
except Exception as e:
    print("Error:", e)
