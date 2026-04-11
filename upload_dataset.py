import os
import sys

os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"
from huggingface_hub import HfApi

# Use environment variable instead of hardcoded token for security
token = os.environ.get("HF_TOKEN", "REPLACE_WITH_YOUR_TOKEN")
api = HfApi(token=token)

repo_id = "joytheslothh/MediRAG-Index-Data"

print(f"Creating dataset repo: {repo_id}")
api.create_repo(repo_id=repo_id, repo_type="dataset", exist_ok=True, private=True)

base_path = r"d:\MediRag 2.0\Backend\data"

print("Uploading large data files to the Dataset repo...")
files_to_upload = [
    ("index/faiss.index", "faiss.index"),
    ("index/metadata_store.pkl", "metadata_store.pkl"),
    ("drugbank vocabulary.csv", "drugbank vocabulary.csv"),
    ("rxnorm_cache.csv", "rxnorm_cache.csv")
]

for local_rel_path, hf_path in files_to_upload:
    local_full = os.path.join(base_path, local_rel_path)
    if os.path.exists(local_full):
        print(f"Uploading {local_full} to {hf_path}...", flush=True)
        try:
            api.upload_file(
                path_or_fileobj=local_full,
                path_in_repo=hf_path,
                repo_id=repo_id,
                repo_type="dataset"
            )
            print(f"Successfully uploaded: {hf_path}")
        except Exception as e:
            print(f"Failed to upload {hf_path}: {e}")
    else:
        print(f"Warning: File not found locally at {local_full}")

print("Dataset upload script finished.")
