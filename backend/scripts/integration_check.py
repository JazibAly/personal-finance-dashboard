import json
import os
import urllib.error
import urllib.parse
import urllib.request

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")
USER_ID = int(os.getenv("USER_ID", "1"))


def request(method: str, path: str, payload: dict | None = None) -> tuple[int, dict]:
    url = f"{BASE_URL}{path}"
    data = None
    headers = {}
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            body_raw = response.read().decode("utf-8")
            body = json.loads(body_raw) if body_raw else {}
            return status, body
    except urllib.error.HTTPError as exc:
        body_raw = exc.read().decode("utf-8")
        body = json.loads(body_raw) if body_raw else {}
        return exc.code, body


def assert_status(actual: int, expected: int, label: str) -> None:
    if actual != expected:
        raise RuntimeError(f"{label} failed: expected {expected}, got {actual}")


def main() -> None:
    # category CRUD
    status, category = request(
        "POST",
        "/categories",
        {
            "user_id": USER_ID,
            "name": "Integration Test Category",
            "monthly_budget": 500,
            "color": "#3366ff",
        },
    )
    assert_status(status, 200, "Create category")
    category_id = category["id"]

    status, _ = request(
        "PUT",
        f"/categories/{category_id}",
        {"name": "Integration Test Category Updated", "monthly_budget": 600},
    )
    assert_status(status, 200, "Update category")

    # income source CRUD
    status, source = request(
        "POST",
        "/income-sources",
        {"user_id": USER_ID, "name": "Integration Salary"},
    )
    assert_status(status, 200, "Create income source")
    source_id = source["id"]

    status, _ = request(
        "PUT",
        f"/income-sources/{source_id}",
        {"name": "Integration Salary Updated"},
    )
    assert_status(status, 200, "Update income source")

    # income CRUD
    status, income = request(
        "POST",
        "/income",
        {
            "user_id": USER_ID,
            "source_id": source_id,
            "amount": 1000,
            "date": "2026-03-31",
            "description": "Integration income",
        },
    )
    assert_status(status, 200, "Create income")
    income_id = income["id"]

    status, _ = request("PUT", f"/income/{income_id}", {"amount": 1200})
    assert_status(status, 200, "Update income")

    # expense CRUD
    status, expense = request(
        "POST",
        "/expenses",
        {
            "user_id": USER_ID,
            "category_id": category_id,
            "amount": 250,
            "description": "Integration expense",
            "date": "2026-03-31",
            "payment_method": "Card",
        },
    )
    assert_status(status, 200, "Create expense")
    expense_id = expense["id"]

    status, _ = request("PUT", f"/expenses/{expense_id}", {"amount": 275})
    assert_status(status, 200, "Update expense")

    # reads + dashboard endpoints
    status, _ = request("GET", f"/income?user_id={USER_ID}")
    assert_status(status, 200, "Get income")

    status, _ = request("GET", f"/expenses?user_id={USER_ID}")
    assert_status(status, 200, "Get expenses")

    status, _ = request("GET", f"/dashboard/summary?user_id={USER_ID}")
    assert_status(status, 200, "Dashboard summary")

    status, _ = request("GET", f"/dashboard/budget-overview?user_id={USER_ID}")
    assert_status(status, 200, "Budget overview")

    # cleanup deletes
    status, _ = request("DELETE", f"/expenses/{expense_id}")
    assert_status(status, 200, "Delete expense")

    status, _ = request("DELETE", f"/income/{income_id}")
    assert_status(status, 200, "Delete income")

    status, _ = request("DELETE", f"/income-sources/{source_id}")
    assert_status(status, 200, "Delete income source")

    status, _ = request("DELETE", f"/categories/{category_id}")
    assert_status(status, 200, "Delete category")

    print("Integration check passed.")


if __name__ == "__main__":
    main()
