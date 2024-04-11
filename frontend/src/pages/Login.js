import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtToken} from '../components/Signals';
import { useUser } from "../context/useUser";

export default function Login(){
const { setUser } = useUser()
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate()

function handleLogin(event) {
  event.preventDefault();
  axios.post('/login', {username, password})
    .then(resp => {
      const token = resp.data.jwtToken;
      if (token) {
        jwtToken.value = token;
        console.log("Login successful");
        navigate("/");
        window.location.reload();
      } else {
        console.error("JWT token not found in response");
      }
    })
    .catch(error => {
      console.error("Login failed:", error.message);
    });
}

return (
      <div>
        <h2>Kirjaudu</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Käyttäjänimi" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"/><br/>
          <input type="password" name="password" placeholder="Salasana" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/><br/>
          <button type="submit">Kirjaudu</button>
        </form>
      </div>
)}
