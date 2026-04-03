#!/bin/bash
export DB_HOST=127.0.0.1
source venv/bin/activate && uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
