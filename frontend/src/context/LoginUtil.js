import axios from "axios";
import { jwtToken } from '../components/Signals';

export function loginUser(username, password) {
  return axios.post('/login', { username, password })
    .then(resp => {
      const token = resp.data.jwtToken;
      if (token) {
        jwtToken.value = token;
        return true; 
      } else {
        console.error("JWT token not found");
        return false; 
      }
    })
    .catch(error => {
      console.error("Login failed:", error.message);
      return false;
    });
}