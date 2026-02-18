import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer-container">
      <p className="footer-text">
        © {new Date().getFullYear()} HeyDayta · All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;