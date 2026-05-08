import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        res = await client.post("http://localhost:8000/api/analyze-debate", json={
            "topic": "AI in exams",
            "for_argument": "AI tools improve student learning.",
            "against_argument": "AI tools reduce student learning.",
            "provider": "gemini"
        }, timeout=30)
        print("Gemini result:", res.status_code, res.json())
        
        res = await client.post("http://localhost:8000/api/analyze-debate", json={
            "topic": "AI in exams",
            "for_argument": "AI tools improve student learning.",
            "against_argument": "AI tools reduce student learning.",
            "provider": "groq"
        }, timeout=30)
        print("Groq result:", res.status_code, res.json())

asyncio.run(test())
