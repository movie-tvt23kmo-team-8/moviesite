import React, { useState, useEffect } from 'react';
import './header.css';
import CinemaTrailer from './MovieTrailer';

export default function Header() {

  return (
    <div className="header">
      <CinemaTrailer />
    </div>
  );
}
