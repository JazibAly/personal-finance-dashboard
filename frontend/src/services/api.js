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

async function fetchJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function postJson(path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return response.json();
}

async function deleteJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return response.json();
}

export async function getExpenses(userId, filters = {}) {
  const query = toQueryString({ user_id: userId, ...filters });
  return fetchJson(`/expenses?${query}`);
}

export async function getCategories(userId) {
  return fetchJson(`/categories?user_id=${userId}`);
}

export async function getIncomeSources(userId) {
  return fetchJson(`/income-sources?user_id=${userId}`);
}

export async function getIncome(userId, filters = {}) {
  const query = toQueryString({ user_id: userId, ...filters });
  return fetchJson(`/income?${query}`);
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
