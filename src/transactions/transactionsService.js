import api from "../commons/api";

export async function getAllTransactions(startDate, endDate) {
  const response = await api.get(
    `/v1/transactions/paged?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function getTransactions(
  startDate,
  endDate,
  page = 0,
  pageSize = 10
) {
  const response = await api.get(
    `/v1/transactions/paged?page=${page}&pageSize=${pageSize}&startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
}

export async function getCategories() {
  const response = await api.get(`/v1/categories`);
  return response.data;
}

export async function createTransaction(data) {
  return await api.post(`/v1/transactions`, data);
}

export async function updateTransaction(data, id) {
  return await api.put(`/v1/transactions/${id}`, data);
}

export async function deleteTransaction(id) {
  return await api.delete(`/v1/transactions/${id}`);
}

export default {
  getAllTransactions,
  getTransactions,
  getCategories,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
