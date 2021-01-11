import api from "../commons/api";

export async function getBudgets() {
  return await api.get("/v1/budgets");
}

export async function getBudgetBalances(period, startDate) {
  return await api.get(
    `/v1/budgets/balances?periodType=${period}&startDate=${startDate}`
  );
}

export async function getBudgetTransactions(id, startDate) {
  return await api.get(`/v1/budgets/${id}/transactions?startDate=${startDate}`);
}

export async function createBudget(data) {
  return await api.post("/v1/budgets", data);
}

export async function updateBudget(data, budgetId) {
  return await api.put(`/v1/budgets/${budgetId}`, data);
}

export async function deleteBudget(budgetId) {
  return await api.delete(`/v1/budgets/${budgetId}`);
}

export default { getBudgets, getBudgetBalances, createBudget };
