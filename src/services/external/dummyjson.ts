// api/productApi.js
import axios from "axios";

export const getProducts = () => {
  return axios.get("https://dummyjson.com/products?limit=0");
};

export const getProductsByCategory = (category: string) => {
  return axios.get(`https://dummyjson.com/products/category/${category}`);
};

export const getProductById = (id: string) => {
  return axios.get(`https://dummyjson.com/products/${id}`);
};
