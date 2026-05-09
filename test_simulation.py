import asyncio
from backend.services.pipeline import run_pipeline
from backend.models.schemas import DebateRequest

text1 = """Bangladesh must implement an immediate and comprehensive ban on single-use plastics to protect its rivers, coastal ecosystems, and public health. The Buriganga, Turag, and Shitalakhya rivers are among the most polluted in the world, with plastic waste being a primary contributor. The Bangladesh River Research Institute documented over 200,000 tonnes of plastic entering waterways annually, directly causing fish mortality rates to increase by 35% over the past decade. Single-use plastics also clog drainage systems, directly worsening urban flooding in Dhaka during monsoon season. Bangladesh was the first country in the world to ban thin polythene bags in 2002, demonstrating the political will to act decisively. Jute, Bangladesh's golden fiber, provides an economically superior and already-established alternative for packaging needs."""

text2 = """A complete ban on single-use plastics in Bangladesh would create severe economic and social disruptions the country is not equipped to handle. Bangladesh's small-scale plastic manufacturing sector employs approximately 2 million workers, predominantly from low-income backgrounds. An abrupt ban without adequate transition and economic safety nets would result in mass unemployment. The practical alternatives—biodegradable packaging, jute, glass—are 3 to 5 times more expensive, inaccessible to most Bangladeshi consumers. Furthermore, the cold chain and food safety infrastructure relies heavily on plastic packaging to prevent contamination. The 2002 polythene bag ban is widely acknowledged to have failed due to poor enforcement, with plastic bags still ubiquitous across markets."""

async def run_both():
    req1 = DebateRequest(topic="Plastic Ban", for_argument=text1, against_argument=text2, provider="groq")
    req2 = DebateRequest(topic="Plastic Ban", for_argument=text1, against_argument=text2, provider="llama33")
    
    loop = asyncio.get_running_loop()
    import concurrent.futures
    with concurrent.futures.ThreadPoolExecutor() as pool:
        print("Starting both...")
        f1 = loop.run_in_executor(pool, run_pipeline, req1)
        f2 = loop.run_in_executor(pool, run_pipeline, req2)
        res1, res2 = await asyncio.gather(f1, f2)
        
    print("RES1 SCORES:", res1.for_score.score, res1.against_score.score)
    print("RES2 SCORES:", res2.for_score.score, res2.against_score.score)

if __name__ == "__main__":
    asyncio.run(run_both())
