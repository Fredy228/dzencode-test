import axios from "axios";

const $authAPI = axios.create({
  withCredentials: true,
  baseURL: process.env.REACT_APP_SERVER_AUTH_URL,
});

export default $authAPI;
