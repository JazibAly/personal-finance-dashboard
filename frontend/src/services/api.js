const API_BASE_URL = "http://localhost:8000";

function toQueryString(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  return search.toString();
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function fetchJson(path) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function postJson(path, body) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function putJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const parsed = await response.json();
      if (parsed.detail) detail = parsed.detail;
    } catch (e) {}
    throw new Error(detail);
  }
  return response.json();
}

async function deleteJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });
  if (!response.ok) {
    let detail = "Request failed";
    try {
      const parsed = await response.json();
      if (parsed.detail) detail = parsed.detail;
    } catch (e) {}
    throw new Error(detail);
  }
  return response.json();
}

export async function loginApi(email, password) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);
  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  if (!response.ok) {
    let detail = "Login failed";
    try {
      const parsed = await response.json();
      if (parsed.detail) detail = parsed.detail;
    } catch (e) {}
    throw new Error(detail);
  }
  return response.json();
}

export async function registerApi(email, password) {
  return postJson("/auth/register", { email, password });
}

export async function getExpenses(filters = {}) {
  const query = toQueryString(filters);
  const qs = query ? `?${query}` : "";
  return fetchJson(`/expenses${qs}`);
}

export async function getCategories() {
  return fetchJson(`/categories`);
}

export async function getIncomeSources() {
  return fetchJson(`/income-sources`);
}

export async function getIncome(filters = {}) {
  const query = toQueryString(filters);
  const qs = query ? `?${query}` : "";
  return fetchJson(`/income${qs}`);
}

export async function createCategory(payload) {
  return postJson(`/categories`, payload);
}

export async function createExpense(payload) {
  return postJson(`/expenses`, payload);
}

export async function createIncomeSource(payload) {
  return postJson(`/income-sources`, payload);
}

export async function updateIncomeSource(sourceId, payload) {
  return putJson(`/income-sources/${sourceId}`, payload);
}

export async function deleteIncomeSource(sourceId) {
  return deleteJson(`/income-sources/${sourceId}`);
}

export async function createIncome(payload) {
  return postJson(`/income`, payload);
}

export async function updateIncome(incomeId, payload) {
  return putJson(`/income/${incomeId}`, payload);
}

export async function deleteIncome(incomeId) {
  return deleteJson(`/income/${incomeId}`);
}

export async function updateExpense(expenseId, payload) {
  return putJson(`/expenses/${expenseId}`, payload);
}

export async function deleteExpense(expenseId) {
  return deleteJson(`/expenses/${expenseId}`);
}

export async function getBudgetOverview() {
  return fetchJson(`/dashboard/budget-overview`);
}

export async function updateCategory(categoryId, payload) {
  return putJson(`/categories/${categoryId}`, payload);
}

export async function updateUserSettings(userId, payload) {
  return putJson(`/users/${userId}/settings`, payload);
}

export async function updateUserProfile(payload) {
  return patchJson(`/auth/profile`, payload);
}

export async function changePassword(payload) {
  return postJson(`/auth/password`, payload);
}
