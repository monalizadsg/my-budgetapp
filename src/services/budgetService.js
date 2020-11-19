import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export async function getBudgets() {
  return await axios.get(`${url}/api/v1/budgets`);
}

export async function getBudgetBalances(period, startDate) {
  return await axios.get(
    `${url}/api/v1/budgets/balances?periodType=${period}&startDate=${startDate}`
  );
}

export async function createBudget(data) {
  return await axios.post(`${url}/api/v1/budgets`, data);
}

export async function updateBudget(data, budgetId) {
  return await axios.put(`${url}/api/v1/budgets/${budgetId}`, data);
}

export async function deleteBudget(budgetId) {
  return await axios.delete(`${url}/api/v1/budgets/${budgetId}`);
}

export default { getBudgets, getBudgetBalances, createBudget };
