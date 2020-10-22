import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export async function getTransactions(
  startDate,
  endDate,
  page = 0,
  pageSize = 5
) {
  const response = await axios.get(
    `${url}/api/v1/transactions/paged?page=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function getCategories() {
  const response = await axios.get(`${url}/api/v1/categories`);
  return response.data;
}

export async function createTransaction(data) {
  return await axios.post(`${url}/api/v1/transactions`, data);
}

export async function updateTransaction(data, id) {
  return await axios.put(`${url}/api/v1/transactions/${id}`, data);
}

export async function deleteTransaction(id) {
  return await axios.delete(`${url}/api/v1/transactions/${id}`);
}

export default {
  getTransactions,
  getCategories,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
