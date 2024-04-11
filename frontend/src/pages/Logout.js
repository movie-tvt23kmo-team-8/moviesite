import React, { useContext, useEffect } from 'react';
import './logout.css'

export default function Logout() {
  useEffect(() => {
    sessionStorage.removeItem('token');
    const time = setTimeout(() => {
    window.location.href = '/';
  }, 3000);

  return () => clearTimeout(time);
}, []);

  return (
    <div>
      <p>Olet kirjautunut ulos!</p>
    </div>
  );
}
