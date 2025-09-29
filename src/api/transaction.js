import axios from "./axios";

export const fetchTransactions = (params) => {
  return axios.get("/transactions", { params }).then((r) => r.data);
};

export const fetchTransactionsBySchool = (schoolId) => {
  return axios.get(`/transactions/school/${schoolId}`).then((r) => r.data);
};

export const checkStatus = (customOrderId) => {
  return axios.get(`/transaction-status/${customOrderId}`).then((r) => r.data);
};

export const createPayment = (payload) => {
  return axios.post("/create-payment", payload).then((r) => r.data);
};
