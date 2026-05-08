# 📊 Academic Poster Content Guide (36" x 48" Format)

*This guide is specifically formatted to meet your instructor's requirements. Set your design software (e.g., Canva, PowerPoint, Illustrator) to **36 inches (width) x 48 inches (height)**. Remember to bring tape to hang it in Lab 504!*

---

## 📌 HEADER (Top Banner)
**Title:** Causal XAI Debate Judge: A Multi-Agent Framework for Explainable Argument Analysis
**Group Members:** [Name 1] (ID: [ID 1]) | [Name 2] (ID: [ID 2]) | [Name 3] (ID: [ID 3])
**Course Code & Name:** [e.g., CSE 4XX: Artificial Intelligence Lab]
**Instructors:** [Instructor Name 1], [Instructor Name 2]

---

## 1. INTRODUCTION
* **The Paradigm Shift:** Large Language Models (LLMs) are highly capable of evaluating text, but traditional single-prompt "LLM-as-a-Judge" systems function as opaque black boxes.
* **The Problem:** When an AI scores a debate, users do not know *why* it made that decision, what logical fallacies were missed, or how the argument structurally failed.
* **The Solution:** We propose a multi-agent framework utilizing Explainable AI (XAI) and causal mapping to provide transparent, deterministic, and highly educational debate analysis.

---

## 2. LITERATURE REVIEW
* **Current State:** Recent research relies heavily on LLM-as-a-judge methodologies (e.g., GPT-4 evaluating chatbot responses). These systems output a score but lack structural transparency.
* **The Gap:** There is a distinct lack of *causal* explainability in AI judging. Existing tools fail to visualize the chain of logic or provide "Counterfactual Reasoning" (what needed to change for a different outcome).
* **Our Approach:** By atomizing the judging process across 8 specialized LangChain agents, we enforce rigorous, step-by-step logical evaluation previously absent in standard LLM applications.

---

## 3. METHODOLOGY 
*(🚨 Instructor requested FLOW CHARTS here! Dedicate a large portion of the poster to a highly visual, aesthetic flowchart of this architecture.)*

**System Architecture & Flow:**
1. **Topic Context Agent:** Analyzes domain and extracts key entities.
2. **Extraction Agent:** Deconstructs arguments into Claims, Reasons, and Evidence.
3. **Causal Reasoning Agent:** Maps directed cause-and-effect chains (Strong/Weak).
4. **Fallacy Detection Agent:** Identifies logical flaws (e.g., Straw Man) and extracts offending quotes.
5. **Evidence Quality Agent:** Scores specific evidence on Relevance and Credibility.
6. **Scoring Agent:** Computes a 100-point score across 6 structural dimensions.
7. **Explanation Agent:** Synthesizes the winner and generates **Counterfactual Feedback**.
8. **Improvement Agent:** An active loop that rewrites weak arguments into high-scoring propositions.

*Tech Stack:* FastAPI, React/Vite, React Flow (for DAGs), LangChain, Groq (LLaMA-3.3-70B).

---

## 4. RESULT
*(🚨 Instructor requested MORE FIGURES here! Include high-quality screenshots/diagrams of these outputs.)*

**Key Visual Outcomes:**
* **Causal Graphs (Figure 1):** Interactive React Flow networks mapping the logic flow. Visually isolates "broken" causal links.
* **Multidimensional Radar Charts (Figure 2):** Side-by-side comparison of the FOR and AGAINST sides across 6 scoring axes (Clarity, Causal Strength, Evidence Quality, etc.).
* **Agent 8 Re-writes (Figure 3):** Demonstrates the system taking a low-scoring argument and actively rewriting it, highlighting the specific improvements made to logic and evidence.
* **Offline Reporting:** The system successfully generates completely paginated, styled PDF reports of the analysis dynamically on the client side.

---

## 5. CONCLUSION
* **Transparency Achieved:** The Causal XAI Debate Judge successfully deconstructs the black-box nature of LLM evaluations, providing users with a clear, step-by-step rationale for every score.
* **Educational Value:** Through counterfactual reasoning and active argument improvement (Agent 8), the system transitions from a passive judge to an interactive debate coach.
* **Future Scope:** The architecture is scalable for real-time audio transcription and integration with Retrieval-Augmented Generation (RAG) for live, empirical fact-checking.
