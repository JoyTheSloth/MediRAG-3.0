# Query Pipeline Endpoint

<cite>
**Referenced Files in This Document**
- [main.py](file://Backend/src/api/main.py)
- [schemas.py](file://Backend/src/api/schemas.py)
- [generator.py](file://Backend/src/pipeline/generator.py)
- [retriever.py](file://Backend/src/pipeline/retriever.py)
- [evaluate.py](file://Backend/src/evaluate.py)
- [aggregator.py](file://Backend/src/evaluation/aggregator.py)
- [ragas_eval.py](file://Backend/src/evaluation/ragas_eval.py)
- [faithfulness.py](file://Backend/src/modules/faithfulness.py)
- [entity_verifier.py](file://Backend/src/modules/entity_verifier.py)
- [source_credibility.py](file://Backend/src/modules/source_credibility.py)
- [contradiction.py](file://Backend/src/modules/contradiction.py)
- [config.yaml](file://Backend/config.yaml)
- [test_api.py](file://Backend/tests/test_api.py)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive API documentation for the POST /query endpoint that powers the complete end-to-end MediRAG pipeline. It covers the request and response schemas, the full workflow from FAISS retrieval through LLM generation to safety evaluation, the intelligent intervention system, practical configuration examples, error handling, thread-safety, performance optimization, and integration patterns for healthcare applications requiring real-time medical Q&A with safety guarantees.

## Project Structure
The API is implemented using FastAPI and organized into modular packages:
- API layer: endpoints, request/response schemas, and orchestration
- Pipeline layer: retriever, generator, and ingestion utilities
- Evaluation layer: module-based evaluators and aggregator
- Configuration: YAML-driven settings for retrieval, modules, LLM, and logging

```mermaid
graph TB
Client["Client"] --> API["FastAPI App<br/>/query endpoint"]
API --> Retriever["Retriever<br/>FAISS + BM25"]
API --> Generator["Generator<br/>LLM answer"]
API --> Evaluator["Evaluator<br/>Modules + Aggregator"]
Evaluator --> Ragas["RAGAS (optional)"]
API --> DB["Audit Logs DB"]
```

**Diagram sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)
- [retriever.py:39-250](file://Backend/src/pipeline/retriever.py#L39-L250)
- [generator.py:344-462](file://Backend/src/pipeline/generator.py#L344-L462)
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [ragas_eval.py:81-178](file://Backend/src/evaluation/ragas_eval.py#L81-L178)

**Section sources**
- [main.py:156-173](file://Backend/src/api/main.py#L156-L173)
- [config.yaml:1-66](file://Backend/config.yaml#L1-L66)

## Core Components
- Endpoint: POST /query
- Request schema: QueryRequest with question, top_k, llm_provider, llm_model, llm_api_key, ollama_url, run_ragas, inject_hallucination
- Response schema: QueryResponse with generated_answer, retrieved_chunks, composite_score, hrs, confidence_level, risk_band, module_results, total_pipeline_ms, and intervention fields

Key behaviors:
- Retrieval: top_k context chunks from FAISS/BioBERT index
- Generation: grounded answer via configurable LLM provider (Gemini, OpenAI, Ollama, Mistral)
- Evaluation: faithfulness, entity verification, source credibility, contradiction detection, optional RAGAS
- Intervention: CRITICAL_BLOCK and HIGH_RISK_REGENERATION based on HRS thresholds

**Section sources**
- [schemas.py:146-231](file://Backend/src/api/schemas.py#L146-L231)
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)

## Architecture Overview
The /query endpoint orchestrates a four-stage pipeline with integrated safety:

```mermaid
sequenceDiagram
participant C as "Client"
participant A as "FastAPI /query"
participant R as "Retriever"
participant G as "Generator"
participant E as "Evaluator"
participant M1 as "Faithfulness"
participant M2 as "Entity Verifier"
participant M3 as "Source Credibility"
participant M4 as "Contradiction"
participant AG as "Aggregator"
C->>A : POST /query {question,top_k,llm_*}
A->>R : search(question,top_k)
R-->>A : [(text,meta,score),...]
A->>G : generate_answer(question,context,overrides)
G-->>A : answer
A->>E : run_evaluation(question,answer,context,run_ragas)
E->>M1 : score_faithfulness
E->>M2 : verify_entities
E->>M3 : score_source_credibility
E->>M4 : score_contradiction
E-->>A : EvalResult (composite_score, details)
A->>AG : aggregate(...)
AG-->>A : EvalResult (composite_score, risk_band, confidence)
A-->>C : QueryResponse (+intervention)
```

**Diagram sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)
- [retriever.py:149-250](file://Backend/src/pipeline/retriever.py#L149-L250)
- [generator.py:344-462](file://Backend/src/pipeline/generator.py#L344-L462)
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [aggregator.py:47-167](file://Backend/src/evaluation/aggregator.py#L47-L167)

## Detailed Component Analysis

### Endpoint Definition and Workflow
- URL: POST /query
- Purpose: End-to-end pipeline from retrieval to evaluation with safety intervention
- Validation: Pydantic validation enforces question length, top_k bounds, and optional overrides
- Safety: Intervention loop applies CRITICAL_BLOCK or HIGH_RISK_REGENERATION based on HRS and faithfulness

```mermaid
flowchart TD
Start(["POST /query"]) --> Validate["Validate QueryRequest"]
Validate --> Retrieve["Retriever.search(question,top_k)"]
Retrieve --> HasResults{"Any results?"}
HasResults --> |No| NotFound["404 Not Found"]
HasResults --> |Yes| Gen["generate_answer(question,context,overrides)"]
Gen --> Eval["run_evaluation(question,answer,context,run_ragas)"]
Eval --> IntvCheck{"HRS ≥ 86 or (HRS ≥ 40 or faithfulness < 1.0)?"}
IntvCheck --> |CRITICAL| Block["CRITICAL_BLOCK: replace answer"]
IntvCheck --> |High Risk| Regen["HIGH_RISK_REGENERATED:<br/>strict prompt + re-eval"]
IntvCheck --> |OK| BuildResp["Build QueryResponse"]
Block --> Log["Log audit + intervention"]
Regen --> Log
BuildResp --> Log
Log --> End(["Return QueryResponse"])
NotFound --> End
```

**Diagram sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)

**Section sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)
- [schemas.py:146-231](file://Backend/src/api/schemas.py#L146-L231)

### Retrieval Pipeline (FAISS + BM25)
- Uses BioBERT SentenceTransformer for embeddings
- FAISS IndexFlatIP with cosine similarity
- Hybrid search with Reciprocal Rank Fusion (RRF)
- Lazy loading of model and index; graceful degradation if FAISS not available

```mermaid
classDiagram
class Retriever {
+config
+top_k
+model_name
+index_path
+meta_path
-_model
-_index
-_metadata
-_bm25
-_bm25_ids
+search(query,top_k) list
-_load_model() void
-_load_index() void
-_build_bm25() void
+rebuild_bm25() void
}
```

**Diagram sources**
- [retriever.py:39-250](file://Backend/src/pipeline/retriever.py#L39-L250)

**Section sources**
- [retriever.py:149-250](file://Backend/src/pipeline/retriever.py#L149-L250)
- [config.yaml:1-10](file://Backend/config.yaml#L1-L10)

### LLM Generation and Provider Overrides
- Supports Gemini, OpenAI, Ollama, and Mistral
- Per-request overrides: provider, api_key, model, ollama_url
- Deterministic judge prompts vs. natural generation prompts
- Strict prompt mode for high-risk regeneration

```mermaid
sequenceDiagram
participant A as "/query handler"
participant G as "generate_answer"
participant P as "Provider Impl"
A->>G : generate_answer(question,context,config,overrides)
G->>G : build_prompt(context)
G->>P : _generate_<provider>(prompt,effective_config)
P-->>G : answer
G-->>A : answer
```

**Diagram sources**
- [generator.py:344-462](file://Backend/src/pipeline/generator.py#L344-L462)

**Section sources**
- [generator.py:344-462](file://Backend/src/pipeline/generator.py#L344-L462)
- [config.yaml:44-52](file://Backend/config.yaml#L44-L52)

### Evaluation Modules and Aggregation
- Faithfulness: DeBERTa cross-encoder NLI over claims vs. context
- Entity Verifier: SciSpaCy NER + RxNorm cache/API for drug verification
- Source Credibility: Evidence tier scoring from metadata or keywords
- Contradiction: NLI-based detection with keyword overlap filter
- Aggregator: Weighted composite with non-linear penalties and risk bands

```mermaid
graph LR
A["Answer"] --> F["Faithfulness"]
A --> EV["Entity Verifier"]
Ctx["Context Chunks"] --> EV
Ctx --> SC["Source Credibility"]
A --> CO["Contradiction"]
F --> AG["Aggregator"]
EV --> AG
SC --> AG
CO --> AG
AG --> OUT["Composite Score + HRS"]
```

**Diagram sources**
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [aggregator.py:47-167](file://Backend/src/evaluation/aggregator.py#L47-L167)
- [faithfulness.py:86-234](file://Backend/src/modules/faithfulness.py#L86-L234)
- [entity_verifier.py:146-283](file://Backend/src/modules/entity_verifier.py#L146-L283)
- [source_credibility.py:121-200](file://Backend/src/modules/source_credibility.py#L121-L200)
- [contradiction.py:94-251](file://Backend/src/modules/contradiction.py#L94-L251)

**Section sources**
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [aggregator.py:47-167](file://Backend/src/evaluation/aggregator.py#L47-L167)
- [ragas_eval.py:81-178](file://Backend/src/evaluation/ragas_eval.py#L81-L178)

### Safety Intervention System
- CRITICAL_BLOCK: HRS ≥ 86 → block response and return a safe message
- HIGH_RISK_REGENERATION: HRS ≥ 40 or faithfulness < 1.0 → regenerate with strict prompt, re-evaluate (skip RAGAS on retry), and record intervention details

```mermaid
flowchart TD
S(["Evaluation Complete"]) --> CheckHRS{"HRS ≥ 86?"}
CheckHRS --> |Yes| Block["CRITICAL_BLOCK<br/>Replace answer + log"]
CheckHRS --> |No| CheckRisk{"HRS ≥ 40 or faithfulness < 1.0?"}
CheckRisk --> |No| OK["Return original answer"]
CheckRisk --> |Yes| Strict["Regenerate with strict prompt"]
Strict --> ReEval["Re-evaluate (no RAGAS)"]
ReEval --> Compare{"Improved?"}
Compare --> |Yes| OK
Compare --> |No| KeepOrig["Keep original answer + log"]
```

**Diagram sources**
- [main.py:413-485](file://Backend/src/api/main.py#L413-L485)

**Section sources**
- [main.py:413-485](file://Backend/src/api/main.py#L413-L485)

### Audit Logging and Database
- SQLite table stores audit logs with fields for endpoint, question, answer, HRS, risk band, composite score, latency, intervention, and details
- Thread-safe ingestion endpoint uses a lock to prevent concurrent FAISS updates

**Section sources**
- [main.py:75-120](file://Backend/src/api/main.py#L75-L120)
- [main.py:524-603](file://Backend/src/api/main.py#L524-L603)

## Dependency Analysis
- API depends on Retriever, Generator, and Evaluator modules
- Evaluator composes Faithfulness, Entity Verifier, Source Credibility, Contradiction, and optionally RAGAS
- Configuration drives model selection, timeouts, and scoring weights

```mermaid
graph TB
API["API /query"] --> RET["Retriever"]
API --> GEN["Generator"]
API --> EVAL["Evaluator"]
EVAL --> MOD1["Faithfulness"]
EVAL --> MOD2["Entity Verifier"]
EVAL --> MOD3["Source Credibility"]
EVAL --> MOD4["Contradiction"]
EVAL --> RAG["RAGAS (optional)"]
API --> CFG["config.yaml"]
RET --> CFG
GEN --> CFG
EVAL --> CFG
```

**Diagram sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [config.yaml:1-66](file://Backend/config.yaml#L1-L66)

**Section sources**
- [main.py:308-520](file://Backend/src/api/main.py#L308-L520)
- [evaluate.py:49-167](file://Backend/src/evaluate.py#L49-L167)
- [config.yaml:1-66](file://Backend/config.yaml#L1-L66)

## Performance Considerations
- Startup warm-up: DeBERTa and Retriever are pre-warmed at app startup to avoid cold-start latency
- Model reuse: Generator reuses the retriever’s SentenceTransformer to avoid double loading
- Latency-aware design: RAGAS is optional and disabled by default; skipped on regeneration to reduce latency
- Concurrency: FAISS ingestion is protected by a thread lock to prevent corruption during dynamic updates
- Tokenization and batching: Modules use efficient segmentation and batching to manage inference costs

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Missing FAISS index: The endpoint raises 503 with a clear message when the FAISS index is not found
- LLM unavailability: The endpoint raises 503 when the configured LLM provider is unreachable
- Empty or invalid queries: Validation errors return 422; ensure question meets minimum length and top_k is within bounds
- No relevant documents: Returns 404 when retrieval yields no results
- Safety intervention: Responses may be blocked or regenerated; check intervention_applied, intervention_reason, and intervention_details in the response

Operational checks:
- Health endpoint: GET /health indicates whether Ollama is reachable
- Audit logs: Use GET /logs and GET /stats to inspect historical evaluations and intervention statistics

**Section sources**
- [main.py:326-347](file://Backend/src/api/main.py#L326-L347)
- [main.py:387-391](file://Backend/src/api/main.py#L387-L391)
- [main.py:206-217](file://Backend/src/api/main.py#L206-L217)
- [test_api.py:46-54](file://Backend/tests/test_api.py#L46-L54)

## Conclusion
The POST /query endpoint delivers a robust, safety-guaranteed, real-time medical Q&A pipeline. It integrates FAISS/BM25 retrieval, configurable LLM generation, comprehensive evaluation modules, and intelligent intervention mechanisms. With thread-safe operations, performance optimizations, and clear error handling, it is suitable for healthcare applications requiring reliable, auditable, and safe responses.