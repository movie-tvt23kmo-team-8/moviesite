import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './register.css';
import axios from "axios";

export default function Register() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleRegister(event) {
    event.preventDefault();
    
    if (!username || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    axios.post('/register', {username, password})
      .then(resp => {
        navigate("/");
        window.location.reload();
      })
      .catch(error => {
        console.error("Register failed:", error.message);
        setError("Registration failed. Username already in use.");
      });
  }

  return (
    <div id="register-form">
      <form onSubmit={handleRegister}>
        <h2>Rekisteröidy</h2>
        <input type="text" name="username" placeholder="Käyttäjänimi" value={username} onChange={e => setUsername(e.target.value)} required /> <br/>
        <input type="password" name="password" placeholder="Salasana" value={password} onChange={e => setPassword(e.target.value)} required /> <br/>
        <button type="submit">Rekisteröidy</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
