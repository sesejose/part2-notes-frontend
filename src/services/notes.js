// This is a module for handling notes-related API requests using axios.
// Used in the part2 excercises 2.12 - 2.15

import axios from "axios";
const baseUrl = "http://localhost:3001/notes";

const getAll = () => {
  return axios.get(baseUrl);
};

// const getAll = () => {
//   const request = axios.get(baseUrl)
//   return request.then(response => response.data)
// }

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

export default {
  getAll: getAll,
  create: create,
  update: update,
};
