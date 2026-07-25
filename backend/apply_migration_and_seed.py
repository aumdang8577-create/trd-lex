import subprocess
import sys
import os

def run_db_push_and_seed():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    venv_python = os.path.join(os.path.dirname(backend_dir), ".venv", "Scripts", "python.exe")
    
    if not os.path.exists(venv_python):
        venv_python = sys.executable

    print(f"Using Python executable: {venv_python}")
    print("Step 1: Pushing Prisma Schema to Database...")
    
    # 1. Run prisma db push via python module
    try:
        res = subprocess.run([venv_python, "-m", "prisma", "db", "push"], cwd=backend_dir, capture_output=True, text=True)
        print("Prisma DB Push Output:", res.stdout)
        if res.stderr:
            print("Prisma DB Push Warnings/Stderr:", res.stderr)
    except Exception as e:
        print("Error running prisma db push:", e)

    # 2. Run seed_geojson_data.py
    print("Step 2: Running seed_geojson_data.py...")
    seed_script = os.path.join(backend_dir, "seed_geojson_data.py")
    try:
        res = subprocess.run([venv_python, seed_script], cwd=backend_dir, capture_output=True, text=True)
        print("Seed Script Output:", res.stdout)
        if res.stderr:
            print("Seed Script Error:", res.stderr)
    except Exception as e:
        print("Error running seed_geojson_data.py:", e)

if __name__ == "__main__":
    run_db_push_and_seed()
