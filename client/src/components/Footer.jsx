import React from 'react';
import '../css/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container-text-center">
        <p>&copy; {new Date().getFullYear()} Nike Dunks. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;