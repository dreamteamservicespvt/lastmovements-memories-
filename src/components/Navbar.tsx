import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link 
            to="/" 
            className="text-white hover:text-party-pink transition-colors"
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/about" 
            className="text-white hover:text-party-pink transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            className="text-white hover:text-party-pink transition-colors"
          >
            Contact
          </Link>
        </li>
        <li>
          <Link 
            to="/gallery" 
            className="text-white hover:text-party-pink transition-colors"
          >
            Gallery
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;