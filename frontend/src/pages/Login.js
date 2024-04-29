import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtToken } from '../components/Signals';
import './login.css'
import Button from '@mui/material/Button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  function handleLogin(event) {
    event.preventDefault();
    axios.post('/login', { username, password })
      .then(resp => {
        const token = resp.data.jwtToken;
        if (token) {
          jwtToken.value = token;
          //console.log("Login successful");
          navigate("/");
          window.location.reload();
        } else {
          console.error("JWT token not found");
          setError("Error loggin in");
        }
      })
      .catch(error => {
        console.error("Login failed:", error.message);
        setError("Login failed. Please check your credentials.");
      });
  }

  return (
    <div className="login">
      <span className='login-title'>Kirjautuminen</span>
      <form className="login-form" onSubmit={handleLogin}>
        <label>Käyttäjänimi</label>
        <input type="text" name="username" placeholder="Käyttäjänimi" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /><br />
        <label>Salasana</label>
        <input type="password" name="password" placeholder="Salasana" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" /><br />
        <Button className='login-button' type="submit" variant="contained">Kirjaudu</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}
