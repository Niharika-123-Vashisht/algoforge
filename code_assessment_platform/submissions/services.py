"""
Judge0 API integration for code execution.
All user code runs ONLY inside Judge0's sandbox (isolate) — never on the Django server.

See: https://github.com/judge0/judge0/blob/master/docs/api/submissions/submissions.md

Security: enable_network=false, cpu/wall/memory limits cap infinite loops and resource abuse.
Dangerous operations (os.system, subprocess, file access) are contained by the sandbox;
we do not execute user code locally.
"""
import requests
from django.conf import settings

# Judge0 status IDs -> our internal status slug
JUDGE0_STATUS_MAP = {
    1: "pending",
    2: "running",
    3: "accepted",
    4: "wrong_answer",
    5: "time_limit",
    6: "memory_limit",
    7: "runtime_error",
    8: "compile_error",
    9: "internal_error",
}

# Human-readable verdicts for API clients (HackerRank-style)
VERDICT_DISPLAY = {
    "accepted": "Accepted",
    "wrong_answer": "Wrong Answer",
    "time_limit": "Time Limit Exceeded",
    "memory_limit": "Memory Limit Exceeded",
    "runtime_error": "Runtime Error",
    "compile_error": "Compilation Error",
    "internal_error": "Internal Error",
    "pending": "Pending",
    "running": "Running",
}

# Platform-wide caps (never exceed these even if problem allows more)
MAX_CPU_TIME_SEC = 2
MAX_MEMORY_MB = 256
MAX_WALL_TIME_SEC = 15  # wall clock; catches sleep/blocking beyond CPU limit
MAX_FILE_SIZE_KB = 1024  # limit files created in sandbox
# Truncate huge stdout/stderr from Judge0 to protect DB and responses
MAX_STDOUT_STDERR_CHARS = 50_000


def _cap_cpu_time(seconds):
    try:
        s = int(seconds)
    except (TypeError, ValueError):
        s = MAX_CPU_TIME_SEC
    return min(max(s, 1), MAX_CPU_TIME_SEC)


def _cap_memory_kb(memory_limit_mb):
    try:
        mb = int(memory_limit_mb)
    except (TypeError, ValueError):
        mb = MAX_MEMORY_MB
    mb = min(max(mb, 16), MAX_MEMORY_MB)
    return mb * 1024


def execute_code(
    source_code: str,
    language_id: int,
    stdin: str = "",
    expected_output: str = None,
    time_limit: int = None,
    memory_limit_mb: int = None,
) -> dict:
    """
    Submit code to Judge0 only (wait=true). Never runs code on Django.

    Limits:
    - cpu_time_limit: capped at MAX_CPU_TIME_SEC
    - wall_time_limit: MAX_WALL_TIME_SEC (prevents hanging beyond CPU accounting)
    - memory_limit: capped at MAX_MEMORY_MB (KB sent to Judge0)
    - enable_network: false
    - max_file_size: limits sandbox file I/O
    """
    cpu_sec = _cap_cpu_time(time_limit if time_limit is not None else MAX_CPU_TIME_SEC)
    memory_kb = _cap_memory_kb(memory_limit_mb if memory_limit_mb is not None else MAX_MEMORY_MB)

    url = f"{settings.JUDGE0_BASE_URL.rstrip('/')}/submissions"
    params = {"base64_encoded": "false", "wait": "true"}
    headers = {"Content-Type": "application/json"}
    if getattr(settings, "JUDGE0_API_KEY", None):
        headers["X-Auth-Token"] = settings.JUDGE0_API_KEY

    payload = {
        "source_code": source_code,
        "language_id": language_id,
        "stdin": stdin or "",
        "cpu_time_limit": float(cpu_sec),
        "cpu_extra_time": 0.5,
        "wall_time_limit": float(MAX_WALL_TIME_SEC),
        "memory_limit": float(memory_kb),
        "max_file_size": MAX_FILE_SIZE_KB,
        "enable_network": False,
    }
    if expected_output is not None:
        payload["expected_output"] = expected_output

    # HTTP timeout must exceed wall_time_limit so Judge0 can finish and return
    http_timeout = int(MAX_WALL_TIME_SEC) + 25

    try:
        resp = requests.post(
            url, params=params, headers=headers, json=payload, timeout=http_timeout
        )
        resp.raise_for_status()
        data = resp.json()
    except requests.Timeout:
        return {
            "status": "time_limit",
            "stdout": "",
            "stderr": "Execution timed out waiting for Judge0 (wall time).",
            "compile_output": "",
            "time": None,
            "memory": None,
            "token": None,
        }
    except requests.RequestException as e:
        return {
            "status": "internal_error",
            "stdout": "",
            "stderr": str(e),
            "compile_output": "",
            "time": None,
            "memory": None,
            "token": None,
        }

    status_id = data.get("status", {}).get("id")
    our_status = JUDGE0_STATUS_MAP.get(status_id, "internal_error")

    def _truncate(text):
        if not text:
            return ""
        if len(text) > MAX_STDOUT_STDERR_CHARS:
            return text[: MAX_STDOUT_STDERR_CHARS] + "\n... [truncated]"
        return text

    return {
        "status": our_status,
        "stdout": _truncate(data.get("stdout") or ""),
        "stderr": _truncate(data.get("stderr") or ""),
        "compile_output": _truncate(data.get("compile_output") or ""),
        "time": data.get("time"),
        "memory": data.get("memory"),
        "token": data.get("token"),
    }


def verdict_to_display(status_slug: str) -> str:
    return VERDICT_DISPLAY.get(status_slug, status_slug.replace("_", " ").title())
