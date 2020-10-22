import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export async function getBudgets() {
  return await axios.get(`${url}/api/v1/budgets`);
}

export async function createBudget(data) {
  return await axios.post(`${url}/api/v1/budgets`, data);
}

export default { getBudgets, createBudget };
