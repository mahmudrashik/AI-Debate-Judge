import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}
data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Explain rate limits"}]
}

resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
print("STATUS:", resp.status_code)
print("HEADERS:")
for k, v in resp.headers.items():
    if 'ratelimit' in k.lower():
        print(f"{k}: {v}")

print("RESPONSE:", resp.json())
