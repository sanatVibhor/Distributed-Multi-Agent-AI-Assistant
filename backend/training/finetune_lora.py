"""
Minimal LoRA fine-tuning scaffold for HF models (optional).
This script is independent from Ollama. Use when USE_OLLAMA=False in rag_service.py
and you have a local HF model you can fine-tune.

Data format: JSONL with fields {"prompt": "...", "response": "..."}
Save adapters under ../adapters/<agent_name>/ and later load in your serving code.
"""
from pathlib import Path
import json
from datasets import Dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments, Trainer, DataCollatorForLanguageModeling
from peft import LoraConfig, get_peft_model, TaskType
import torch

MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"
DATA_FILE = Path(__file__).parent / "data_sample.jsonl"
OUTPUT_DIR = Path(__file__).parent.parent / "adapters" / "default_agent"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def load_data():
    rows = []
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        for line in f:
            obj = json.loads(line)
            text = f"<s>[INST] {obj['prompt']} [/INST] {obj['response']}</s>"
            rows.append({"text": text})
    return Dataset.from_list(rows)

def main():
    tok = AutoTokenizer.from_pretrained(MODEL_ID, use_fast=True)
    if tok.pad_token is None:
        tok.pad_token = tok.eos_token

    model = AutoModelForCausalLM.from_pretrained(MODEL_ID, torch_dtype=torch.float16, device_map="auto")
    lora = LoraConfig(
        r=16, lora_alpha=32, lora_dropout=0.05, bias="none",
        task_type=TaskType.CAUSAL_LM, target_modules=["q_proj","v_proj"]
    )
    model = get_peft_model(model, lora)

    ds = load_data()

    def tokenize(batch):
        return tok(batch["text"], truncation=True, max_length=1024)

    tokenized = ds.map(tokenize, batched=True, remove_columns=["text"])
    collator = DataCollatorForLanguageModeling(tokenizer=tok, mlm=False)

    args = TrainingArguments(
        output_dir=str(OUTPUT_DIR),
        per_device_train_batch_size=1,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        num_train_epochs=1,
        logging_steps=10,
        save_steps=100,
        bf16=torch.cuda.is_available(),
        optim="paged_adamw_32bit" if torch.cuda.is_available() else "adamw_torch"
    )
    trainer = Trainer(model=model, args=args, train_dataset=tokenized, data_collator=collator)
    trainer.train()
    model.save_pretrained(str(OUTPUT_DIR))
    print(f"Saved LoRA adapter to {OUTPUT_DIR}")

if __name__ == "__main__":
    main()
