import os
import pytest
import pytest_asyncio
import asyncio
import subprocess
import sys
import httpx

# Disable all proxies for localhost/internal communication during tests
os.environ["NO_PROXY"] = "*"
os.environ["no_proxy"] = "*"

# Force the DATABASE_URL to point to the test database (allow environment override)
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/trd_lex_test?schema=public"
)

@pytest.fixture(scope="session", autouse=True)
def setup_db():
    print("\n[conftest] Resetting and pushing test database schema...")
    env = os.environ.copy()
    env["DATABASE_URL"] = os.environ["DATABASE_URL"]
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    schema_path = os.path.join(base_dir, "prisma", "schema.prisma")
    
    # Add virtual env's Scripts/bin directory to PATH so prisma-client-py can be spawned
    scripts_dir = os.path.join(base_dir, ".venv", "Scripts")
    if not os.path.exists(scripts_dir):
        scripts_dir = os.path.join(base_dir, ".venv", "bin")
    env["PATH"] = scripts_dir + os.pathsep + env.get("PATH", "")
    
    # Run prisma db push with force-reset and accept-data-loss
    subprocess.run([
        sys.executable, "-m", "prisma", "db", "push",
        f"--schema={schema_path}",
        "--accept-data-loss",
        "--force-reset"
    ], env=env, check=True)

@pytest_asyncio.fixture(autouse=True)
async def clean_db():
    """
    Clean database tables before each test to maintain isolation.
    """
    from app.core.database import db
    if not db.is_connected():
        await db.connect()
    # Delete all data in reverse order of dependencies
    await db.listing.delete_many()
    await db.leasecontract.delete_many()
    await db.user.delete_many()

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the session."""
    policy = asyncio.get_event_loop_policy()
    loop = policy.new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture
async def client():
    """Fixture to provide an HTTPX AsyncClient for FastAPI testing."""
    from app.main import app
    # Use ASGITransport to trigger startup/shutdown lifecycle events (connecting/disconnecting db)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
