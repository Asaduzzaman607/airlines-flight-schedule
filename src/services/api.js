import axios from "axios";
import { BASE_URL } from '../config'

const baseURL = BASE_URL + '/api';

const API = axios.create({
    baseURL
});

const getAccessToken = () => {
  return localStorage.getItem('token');
}

API.interceptors.request.use(function (config) {
    config.headers['Authorization'] = `Bearer ${getAccessToken()}`;
    return config;
});

export default API;