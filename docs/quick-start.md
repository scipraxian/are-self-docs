---
id: quick-start
title: "Quick Start"
sidebar_position: 3
---

# Quick Start

Get Are-Self up and running in 5 minutes. This guide walks you through installation, initial setup, and firing your first spike train.

## Prerequisites

Before you begin, ensure you have installed:

- **Python 3.11+**
- **Node.js 18+**
- **PostgreSQL** with `pgvector` extension
- **Redis** (for Celery task queue)
- **Ollama** (for local LLM inference)

## Clone & Install

### 1. Clone Repositories

```bash
git clone https://github.com/scipraxian/are-self-api
git clone https://github.com/scipraxian/are-self-ui

cd are-self-api
```

### 2. Backend Setup

Install Python dependencies and run migrations:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd are-self-ui
npm install
npm run dev
```

The UI will be available at `http://localhost:5173` (Vite development server).

### 4. Celery Worker

In another terminal, start the Celery worker for distributed task execution:

```bash
cd are-self-api
celery -A are_self worker -l info
```

You'll see output like:

```
  -------------- celery@hostname v5.x.x (opalescence)
  --- ***** -----
  -- ******* ----
  - *** --- * ---
  - ** ---------- [config]
  - ** ----------
  - *** --- * --- [queues]
  --------- ****
  -------- *****

 [Tasks]
  . your_app.tasks.task_name
```

The worker is now ready to execute spike trains.

## First Steps

### 1. Open the Dashboard

Navigate to `http://localhost:5173/` in your browser. You'll see the **Blood Brain Barrier** dashboard with:

- Central Nervous System (CNS) overview
- Environment management
- System status and activity log

### 2. Create Your First Environment

Environments scope tools, variables, and settings to your project context.

1. Click **Environments** in the sidebar
2. Click **"+ New Environment"**
3. Fill in the form:
   - **NAME**: "My First Project"
   - **DESCRIPTION**: "Development environment"
   - **TYPE**: Select "Python" (or your preferred stack)
   - **STATUS**: "Online"
   - **AVAILABLE**: Check the box
4. Click **"+ Add Variable"** to add context variables:
   - KEY: `project_root`, VALUE: `/path/to/my/project`
   - KEY: `python_interpreter`, VALUE: `/usr/bin/python3`
5. Save and set as active

### 3. Create an Identity

Identities represent agents or personas that execute spike trains. Create your first identity:

1. Click **Identity Ledger** in the sidebar
2. Click **"+ New Identity"**
3. Fill in the form:
   - **NAME**: "Developer Agent"
   - **TYPE**: "System Agent"
   - **DESCRIPTION**: "Primary development identity"
4. Click **"Forge Identity Disc"** to generate a cryptographic identity (used for authorization)
5. Save

### 4. Pull a Local Model

Pull a model from Ollama to enable local LLM inference:

1. Click **Hypothalamus** in the sidebar
2. Look for the Ollama sync section
3. Click **"Sync Local"** or **"Pull Model"**
4. Select a model (e.g., "mistral", "llama2")
5. Wait for download and import

Your Are-Self instance now has local inference available — no API keys or external services required.

### 5. Create a Neural Pathway

Neural Pathways are spike train templates that define execution logic.

1. Click **CNS Editor** in the sidebar
2. Click **"+ New Neural Pathway"**
3. Define your pathway:
   - **NAME**: "Hello World"
   - **DESCRIPTION**: "First test spike train"
   - **INPUT PORTS**: Click "Add Port" and create a text input (e.g., "message")
   - **OUTPUT PORTS**: Create a text output (e.g., "response")
4. In the pathway editor:
   - Add a **Spike** node that calls your local model
   - Connect input → Spike → output
   - Configure the Spike with a simple prompt (e.g., "Echo the input message")
5. Click **Save**

### 6. Fire Your First Spike Train

Execute your neural pathway:

1. Click **CNS Monitor** in the sidebar
2. Click **"+ New Spike Train"**
3. Select your "Hello World" neural pathway
4. Fill in the input:
   - **message**: "Are-Self is alive!"
5. Click **"Execute"** or **"Fire Spike Train"**
6. Watch the **Spike Monitor** in real-time:
   - Status updates (Queued → Running → Completed)
   - Output results
   - Execution logs

Congratulations! You've fired your first spike train. The CNS Monitor shows:

- Task status and timestamps
- Celery worker assignment (which machine executed it)
- Input/output values
- Execution duration and logs

## What's Next

Now that you have the basics working:

- **[Getting Started Guide](/docs/getting-started)**: In-depth walkthrough of core concepts
- **[Architecture Overview](/docs/architecture)**: Understand how CNS, PNS, and Hypothalamus work together
- **[UI Walkthroughs](/docs/ui/blood-brain-barrier)**: Deep-dive into each interface (Environments, Identity Ledger, CNS Editor, etc.)
- **[API Reference](/docs/api-reference)**: Build programmatic spike trains via REST/WebSocket
- **[Security](/docs/security)**: Data privacy, responsible AI, and incident response

## Troubleshooting

**Backend won't start:**
```bash
# Check PostgreSQL is running
psql -U postgres -d are_self -c "SELECT 1"

# Check migrations
python manage.py migrate --noinput

# Check Redis
redis-cli ping  # Should return PONG
```

**Frontend won't connect to API:**
- Ensure the backend is running at `http://localhost:8000`
- Check browser console for CORS errors
- Verify `REACT_APP_API_URL` environment variable is set correctly

**Celery worker not executing tasks:**
- Ensure Redis is running (`redis-cli ping`)
- Check worker console for error messages
- Restart the worker with `celery -A are_self worker -l debug` for verbose output

**Model sync failing:**
- Ensure Ollama is running (`ollama list` from command line)
- Check Ollama is accessible at `http://localhost:11434`
- Try pulling a model directly: `ollama pull mistral`