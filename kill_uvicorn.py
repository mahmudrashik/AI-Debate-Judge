import psutil
import os

for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
    try:
        cmdline = proc.info.get('cmdline') or []
        if 'python' in proc.info['name'].lower() or 'uvicorn' in ' '.join(cmdline).lower():
            if 'uvicorn' in ' '.join(cmdline).lower() and 'backend.main:app' in ' '.join(cmdline).lower():
                print(f"Killing uvicorn process: {proc.info['pid']}")
                proc.kill()
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        pass
