import axios from "axios";

const url = process.env.REACT_APP_API_URL;

export async function getTransactions(currentPage, pageSize) {
  let response;
  try {
    response = await axios.get(
      `${url}/api/v1/transactions?page=${currentPage}&pageSize=${pageSize}`
    );
  } catch (err) {
    console.log(err.message);
  }
  return response.data;
}

export async function getCategories() {
  let response;
  try {
    response = await axios.get(`${url}/api/v1/categories`);
  } catch (err) {
    console.log(err.message);
  }
  return response.data.categories;
}

export async function createTransaction(data) {
  let response;
  try {
    response = await axios.post(
      "http://192.168.0.188:8086/api/v1/transactions",
      data
    );
  } catch (err) {
    console.log(err.message);
  }
  console.log("Returned postData:", response);
}

export default { getTransactions, getCategories, createTransaction };
