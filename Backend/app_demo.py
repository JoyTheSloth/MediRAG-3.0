"""
MediRAG Backend - Local Demo Version
Simplified version for local testing without heavy models
"""

import os
import gradio as gr

# Mock functions for demo
def health_check():
    return {"status": "ok", "demo_mode": True}

def query_medical(question: str, top_k: int = 5, mistral_api_key: str = "", google_api_key: str = ""):
    """Demo version - returns mock response"""
    
    # Simulate processing
    demo_answer = f"""
This is a DEMO response for: "{question}"

In the full version, this would:
1. Retrieve relevant medical documents from FAISS index
2. Generate answer using Mistral/Gemini LLM
3. Evaluate with 4-layer audit system
4. Return Health Risk Score (HRS)

**To run full version:**
- Deploy to Hugging Face Spaces (Docker)
- Or install all dependencies locally
"""
    
    demo_output = f"""
🏥 **MEDICAL ANSWER (DEMO MODE)**

{demo_answer}

---
📊 **RISK ASSESSMENT**
• Health Risk Score (HRS): 25/100 (DEMO)
• Risk Band: LOW
• Confidence: MEDIUM

---
🧪 **MODULE SCORES (DEMO)**
✓ Faithfulness: 0.85
✓ Entity Accuracy: 0.90
✓ Source Credibility: 0.88
✓ Contradiction Risk: 0.95

---
📚 **TOP SOURCES (DEMO)**
📄 Source 1: PubMed - Clinical Study (Score: 0.923)
This is a placeholder for retrieved medical literature...

📄 Source 2: PMC - Systematic Review (Score: 0.891)
Another placeholder for medical evidence...

---
⏱️ Total Time: 1250ms (DEMO)

---
⚠️ **NOTE**: This is running in DEMO mode without the full ML models.
For full functionality, deploy to Hugging Face Spaces or install all dependencies.
    """.strip()
    
    return demo_output

# Create Gradio interface
with gr.Blocks(title="MediRAG - Medical AI Demo") as demo:
    gr.Markdown("""
    # 🏥 MediRAG 2.0 - DEMO MODE
    ## Medical Question Answering with Hallucination Detection
    
    **⚠️ This is a DEMO version for local testing.**
    
    The full version includes:
    - 107,425+ medical documents in FAISS index
    - BioBERT embeddings for retrieval
    - Mistral/Gemini LLM for generation
    - 4-layer audit system (DeBERTa-v3, SciSpaCy)
    - Health Risk Score calculation
    
    **Deploy to Hugging Face Spaces for full functionality:**
    https://huggingface.co/spaces/joytheslothh/MediRAG-API
    """)
    
    with gr.Accordion("⚙️ API Configuration (Optional)", open=False):
        gr.Markdown("""
        In the full version, provide your API keys for LLM generation:
        - **Mistral API Key**: https://console.mistral.ai/
        - **Google API Key**: https://makersuite.google.com/app/apikey
        """)
        with gr.Row():
            mistral_key_input = gr.Textbox(
                label="Mistral API Key",
                placeholder="Enter your Mistral API key (full version only)",
                type="password",
                value=""
            )
            google_key_input = gr.Textbox(
                label="Google API Key (Gemini)",
                placeholder="Enter your Google API key (full version only)",
                type="password",
                value=""
            )
    
    with gr.Row():
        with gr.Column():
            question_input = gr.Textbox(
                label="Your Medical Question",
                placeholder="e.g., What are the side effects of metformin?",
                lines=3
            )
            top_k_slider = gr.Slider(
                minimum=1,
                maximum=10,
                value=5,
                step=1,
                label="Number of Sources to Retrieve"
            )
            submit_btn = gr.Button("🔍 Ask MediRAG (Demo)", variant="primary")
        
        with gr.Column():
            output_text = gr.Markdown(label="Response")
    
    submit_btn.click(
        fn=query_medical,
        inputs=[question_input, top_k_slider, mistral_key_input, google_key_input],
        outputs=output_text
    )
    
    gr.Markdown("""
    ---
    ### 🚀 How to Run Full Version
    
    **Option 1: Hugging Face Spaces (Recommended)**
    ```
    1. Visit: https://huggingface.co/spaces/joytheslothh/MediRAG-API
    2. The full app is already deployed there!
    ```
    
    **Option 2: Local with Docker**
    ```bash
    cd Backend
    docker build -t medirag .
    docker run -p 7860:7860 medirag
    ```
    
    **Option 3: Local with Virtual Environment**
    ```bash
    cd Backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements_hf.txt
    python -m spacy download en_core_sci_lg
    python app.py
    ```
    
    ### 🔬 Full System Features
    - **Faithfulness**: DeBERTa-v3 NLI model checks claim support
    - **Entity Verification**: SciSpaCy + DrugBank for drug/dosage validation
    - **Source Credibility**: Ranks evidence by publication tier
    - **Contradiction Detection**: Internal NLI cross-check for self-contradictions
    """)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    demo.launch(
        server_name="0.0.0.0",
        server_port=port,
        share=False,
        show_error=True
    )
