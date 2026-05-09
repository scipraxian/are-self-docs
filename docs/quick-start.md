---
id: quick-start
title: "Install Are-Self"
sidebar_position: 3
---

# Install Are-Self

Welcome. If you can install four programs and copy-paste seven lines into a window, you can run Are-Self on your own computer.

That's the whole promise of this page. No credit card, no cloud account, no CS degree. Go slowly. Grab a cup of tea. Most of the time is just waiting for downloads.

:::info A note for iPad, iPhone, and Android phone owners

This page is for **desktops and laptops**. Are-Self runs a database, a web server, and the AI models all on the same machine — that combination needs a desktop or laptop operating system underneath, and iPads, iPhones, and Android phones are sealed by design in ways that don't allow it. So while we'd love to put Are-Self on every device, the local install has to live on a Windows PC, a Mac, or a Linux desktop or laptop.

If a tablet or phone is the only computer you have, you can still use AI for free over the internet — see [Will It Run?](./will-it-run.md#the-free-cloud-escape-hatch) for the cloud-endpoint path.

:::

## Before you start

You'll need:

- A computer with **16 GB of RAM or more** and roughly **30 GB of free disk space**.
- **Windows 10 or 11**, or a Mac, or a Linux machine. (These instructions are written for Windows — there's a short Mac/Linux note at the bottom.)
- An internet connection for the install — most of the time is downloading.
- About **30 to 60 minutes**, mostly waiting.

If you're not sure your computer can handle it, the [Will It Run?](./will-it-run.md) page walks you through the answer in detail — including what to do if the answer is "not really."

## Step 1 — Install the four prerequisite apps

Are-Self stands on top of four programs. Each has its own official installer page. Open each one in your browser, download the **Windows installer**, run it, and accept the defaults. The installer pages know how to install themselves better than we do — let them lead.

- **Ollama** — runs the AI models locally → [ollama.com/download](https://ollama.com/download)
- **Docker Desktop** — runs the database and supporting services → [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
- **Git for Windows** — downloads Are-Self from GitHub → [git-scm.com/download/win](https://git-scm.com/download/win)
- **Python** — runs the Are-Self brain → [python.org/downloads/windows](https://www.python.org/downloads/windows/) — **check the "Add Python to PATH" box during install. This one matters.**

A few small things to expect:

- Docker Desktop will probably ask you to **restart your computer** when it finishes. Do it.
- Docker may also ask to enable WSL 2 along the way. Say yes.
- After everything is installed, **close any PowerShell or Command Prompt windows that were already open** before moving on — they won't see the new programs until you open a fresh window.

That's it for app installs. Four downloads, four installers, no surprises we can promise about.

## Step 2 — Open PowerShell

Press the **Windows key**, type `powershell`, and press Enter. A blue (or black) window opens — that's your terminal. From here on, you'll be typing commands instead of clicking buttons.

:::tip Heads up: PowerShell may not open in your home folder
The first thing your window says might be `C:\Windows\System32>` or similar — *not* a path with your name in it. That's normal. The very first command in the next step moves you to your home folder, where you actually want to be.
:::

## Step 3 — Get the code and run the installer

Type each line below into PowerShell, one at a time, and press Enter after each. Wait for one to finish before typing the next.

```
cd ~
mkdir are-self
cd are-self
git clone https://github.com/scipraxian/are-self-api
git clone https://github.com/scipraxian/are-self-ui
cd are-self-api
./are-self-install.bat
```

What each line does:

1. **`cd ~`** — moves you to your home folder (the one with your name on it). On Windows that's usually `C:\Users\<your-name>`.
2. **`mkdir are-self`** — creates a new folder named `are-self` inside your home folder.
3. **`cd are-self`** — steps into the new folder.
4. **`git clone https://github.com/scipraxian/are-self-api`** — downloads the Are-Self brain (the backend) into a folder called `are-self-api`.
5. **`git clone https://github.com/scipraxian/are-self-ui`** — downloads the Are-Self interface (the frontend) into a folder called `are-self-ui`. Both folders end up side-by-side, which is what the installer expects.
6. **`cd are-self-api`** — steps into the brain folder.
7. **`./are-self-install.bat`** — runs the installer script that does the rest.

The installer takes **10 to 30 minutes**. It opens Docker if it isn't running, installs the Python packages Are-Self needs, sets up the database, pulls the embedding model the memory system uses, loads the starter data, and creates an admin login. It tells you what it's doing at every step. When you see **INSTALLATION COMPLETE**, you're done.

## Step 4 — Launch Are-Self

In File Explorer, open the `are-self-api` folder and double-click **`are-self.bat`**. (Or type `./are-self.bat` in the same PowerShell window.)

This starts the database, the worker, the brain server, and the interface — and opens your browser to Are-Self automatically.

You should see the 3D brain landing page at [http://localhost:5173](http://localhost:5173) within about 10 seconds. The admin backend is at [http://localhost:8000/admin](http://localhost:8000/admin) — log in with `admin` / `admin` if you ever need to poke around the raw database.

**That's it. Are-Self is installed and running on your own computer.**

Next up: [Getting Started](./getting-started.md) walks you through your first hour — create an environment, design an identity, and watch a reasoning session happen in real time.

:::tip Want to verify Ollama works on its own first?
Type `ollama run llama3.2` in PowerShell. The first run downloads the model (about 2 GB — give it a few minutes). When you see `>>> Send a message`, type `hello` and press Enter. The model will reply. Type `/bye` to leave. From now on you have a real AI model on your own computer that you can use any time, even outside Are-Self.
:::

## On a Mac or Linux

The same four prerequisites — Ollama, Docker Desktop, Git, Python — install on Mac (use Homebrew or each app's official Mac installer) and Linux (use your distro's package manager or the official Linux installers).

The `are-self-install.bat` and `are-self.bat` launchers are Windows-only, but every step they run is a normal command. After cloning the repos as siblings under `~/are-self/`, the equivalent Mac/Linux sequence is:

```bash
cd are-self-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
docker compose up -d
docker exec -i are_self_db psql -U postgres -d postgres -c "CREATE EXTENSION IF NOT EXISTS vector;"
python manage.py migrate
ollama pull nomic-embed-text
python manage.py loaddata genetic_immutables.json zygote.json initial_phenotypes.json
DJANGO_SUPERUSER_USERNAME=admin DJANGO_SUPERUSER_EMAIL=admin@are-self.com DJANGO_SUPERUSER_PASSWORD=admin python manage.py createsuperuser --noinput
cd ../are-self-ui
npm install
```

To run Are-Self after installing, you'll need three terminals open. From `are-self-api/`:

```bash
# Terminal 1 — Celery worker
source venv/bin/activate
celery -A config worker --loglevel=info --concurrency=4 -P threads -E

# Terminal 2 — Django server
source venv/bin/activate
python manage.py runserver
```

And from `are-self-ui/`:

```bash
# Terminal 3 — Vite dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Troubleshooting

### PowerShell says "git is not recognized" (or "python," "docker," "ollama")

The program installed fine, but the PowerShell window you have open was started **before** the install finished. PowerShell only checks for new programs when it opens. Close that window and open a new one — Windows key, type `powershell`, Enter.

### The installer says "Python is not recognized"

Python isn't installed, or it isn't on your PATH. Reinstall it from [python.org/downloads/windows](https://www.python.org/downloads/windows/), and **make sure to check the "Add Python to PATH" box** on the first screen of the installer. Then close and reopen PowerShell, and run `./are-self-install.bat` again.

### Docker Desktop install fails with "ProgramData\DockerDesktop must be owned by an elevated account"

This one isn't on you. An earlier Docker install didn't finish cleanly, and the leftover folder is confusing the new installer. The fix is to throw the leftover folder away and let the fresh installer start clean.

1. Open File Explorer and go to `C:\ProgramData`. If you don't see a `ProgramData` folder, click the **View** tab at the top and turn on **Hidden items**.
2. Right-click the `DockerDesktop` folder and choose **Delete**.
3. If Windows pops up a box asking for administrator permission, click **Continue**.
4. Now right-click the Docker Desktop installer again and choose **Run as administrator**. Windows will dim the screen and ask whether you want to let it make changes — click **Yes**.

Once Docker Desktop finishes installing, restart your computer and resume from Step 2.

### The installer says "Docker is not running"

Launch **Docker Desktop** from your Start menu and wait until the whale icon in your system tray is steady (not animating). Then re-run `./are-self-install.bat`.

### The installer hangs on "Waiting for Ollama daemon"

Ollama may not have started yet. Look for the llama icon in your system tray. If it's missing, launch Ollama from your Start menu. The installer will pick up once Ollama answers.

### The browser opens but shows "Unable to connect"

The interface takes a few seconds to warm up after `are-self.bat` launches. Give it 10 seconds and refresh. If it still doesn't load, check the **Are-Self Django Server** window for error messages.

### "Port 80 is already in use"

Something else on your computer (often Skype or IIS on Windows) is holding port 80. Are-Self still works without that piece — you'll reach the interface at [http://localhost:5173](http://localhost:5173) directly instead of through `http://local.are-self.com`. If you want the proxy anyway, stop whatever is holding port 80, or edit `docker-compose.yml` to map it to a different port.

### Memory isn't forming

The memory system needs the `nomic-embed-text` model. Run `ollama list` from a terminal — you should see `nomic-embed-text` in the list. If you don't, run `ollama pull nomic-embed-text` and restart `are-self.bat`.

### Something else broke and I don't know what

Open a fresh PowerShell window, run `ollama run llama3.2`, paste in the error message you saw, and ask the model what to do. It often knows. If it doesn't, file an issue at [github.com/scipraxian/are-self-api/issues](https://github.com/scipraxian/are-self-api/issues) with the text of the error and we'll take a look.

## What's next

Now that Are-Self is running:

- [Getting Started](./getting-started.md) — a guided first hour, from empty system to watching an AI persona reason through a task.
- [Architecture Overview](./architecture.md) — how the brain regions connect and why the tick cycle is shaped the way it is.
- [UI Walkthroughs](./ui/blood-brain-barrier.md) — page-by-page tour of the interface.
- [OpenRouter](./openrouter.md) — optional: plug in a cloud model as failover for jobs your local hardware can't handle.
