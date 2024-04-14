import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './register.css';
import axios from "axios";
import Button from '@mui/material/Button';

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
    <div className='register'>
      <span className='register-title'>Rekisteröityminen</span>
      <form className="register-form" onSubmit={handleRegister}>
        <label>Käyttäjänimi</label>
        <input type="text" name="username" placeholder="Käyttäjänimi" value={username} onChange={e => setUsername(e.target.value)} required /> <br/>
        <label>Salasana</label>
        <input type="password" name="password" placeholder="Salasana" value={password} onChange={e => setPassword(e.target.value)} required /> <br/>
        <Button className='register-button' type="submit" variant="contained">Rekisteröidy</Button>
      </form>
      {error && <p>{error}</p>}
    </div>
    
  );
}


