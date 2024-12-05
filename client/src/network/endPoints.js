let baseUrl;

if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:8000/api";
}

export { baseUrl };

const ENDPOINTS = {
  SIGNIN: `${baseUrl}/users/login`,
  SIGNUP: `${baseUrl}/users/signup`,
  GET_ALL_EMPLOYEE: `${baseUrl}/users/employees`,
  CREATE_LAPTOP: `${baseUrl}/laptops/create`,
  GET_ALL_LAPTOP: `${baseUrl}/laptops/getLaptops`,
  GET_LAPTOP: `${baseUrl}/laptops/getLaptop/${id}`,
  UPDATE_LAPTOP: `${baseUrl}/laptops/getLaptop/${id}`,
  DELETE_LAPTOP: `${baseUrl}/laptops/getLaptop/${id}`,
};

export default ENDPOINTS;
