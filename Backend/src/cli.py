import typer
import subprocess
import webbrowser
import time
import socket
import os
import sys

app = typer.Typer(help="MediRAG Command Line Interface")

def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

@app.command()
def start():
    """Start the full MediRAG experience (Backend + Full Frontend)"""
    typer.echo("Starting full MediRAG experience...")
    run_servers(practical_mode=False)

@app.command()
def api():
    """Start the streamlined 'practical' UI"""
    typer.echo("Starting streamlined MediRAG practical UI...")
    run_servers(practical_mode=True)

def run_servers(practical_mode: bool):
    # Check ports
    if is_port_in_use(8000):
        typer.echo("Warning: Port 8000 (Backend) might already be in use.")
    if is_port_in_use(5173):
        typer.echo("Warning: Port 5173 (Frontend) might already be in use.")

    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    frontend_dir = os.path.join(os.path.dirname(backend_dir), "Frontend")

    # Start Backend
    typer.echo("Starting Backend server...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "src.api.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=backend_dir
    )

    # Start Frontend
    typer.echo("Starting Frontend server...")
    # On Windows, npm run dev needs shell=True or using cmd /c
    frontend_process = subprocess.Popen(
        ["cmd", "/c", "npm", "run", "dev"] if os.name == 'nt' else ["npm", "run", "dev"],
        cwd=frontend_dir
    )

    typer.echo("Waiting for servers to start...")
    time.sleep(5)  # Basic wait for frontend to spin up

    url = "http://localhost:5173/cli-view" if practical_mode else "http://localhost:5173/"
    typer.echo(f"Opening browser at {url}...")
    webbrowser.open(url)

    try:
        # Keep process alive
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        typer.echo("\nShutting down servers...")
        backend_process.terminate()
        frontend_process.terminate()
        typer.echo("Servers stopped.")

if __name__ == "__main__":
    app()
