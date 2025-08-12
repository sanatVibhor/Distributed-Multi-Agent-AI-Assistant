# RAG Chat (LangChain + Chroma + Streamlit)

Local-first Retrieval-Augmented Generation (RAG) app with a simple trust/feedback loop.

## Features
- Chunk + embed your docs into a persistent Chroma vector DB.
- Query via Streamlit chat UI.
- Show source snippets used for answers.
- Thumbs up/down feedback updates a simple trust score (stored in `trust.json`).
- Works with **Ollama** (recommended) or **Hugging Face Transformers** fallback.

## Quickstart
1. Ensure Python 3.10+.
2. Install requirements:
   ```bash
   pip install -r requirements.txt
