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

export default { getTransactions, getCategories };
