import axios from 'axios';

export const get_department = async (id) => {
  try {
    const response = await axios.get(`http://82.29.197.244:8080/departments/${id}`);
    return response.data.data;
  } catch (error) {}
};

export const api = {
  get_department,
};
