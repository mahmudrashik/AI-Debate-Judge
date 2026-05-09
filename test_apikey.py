import os
import requests
from dotenv import load_dotenv

load_dotenv(override=True)

primary_key = os.getenv("GROQ_API_KEY")
secondary_key = os.getenv("GROQ_API_KEY_SECONDARY")

print("Primary key starts with:", primary_key[:10])
print("Secondary key starts with:", secondary_key[:10])

headers = {
    "Authorization": f"Bearer {secondary_key}",
    "Content-Type": "application/json"
}

data = {
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "Hi"}]
}

resp = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data)
print("STATUS:", resp.status_code)
if resp.status_code != 200:
    print("ERROR:", resp.text)
else:
    print("SUCCESS")
