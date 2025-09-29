import axios from "./axios";

export const login = async (email, password) => {
  const resp = await axios.post("/auth/login", { email, password });
  return resp.data;
};

export const signup = async (name, email, password) => {
  const resp = await axios.post("/auth/signup", { name, email, password });
  return resp.data;
};
