import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex-shrink-0 font-bold text-xl">
            TechJobs Alert
          </Link>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-200"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-gray-200">Home</Link>
            <Link to="/jobs" className="hover:text-gray-200">Jobs</Link>
            <Link to="/resources" className="hover:text-gray-200">Resources</Link>
            <Link to="/about" className="hover:text-gray-200">About</Link>
            <Link to="/contact" className="hover:text-gray-200">Contact</Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 hover:bg-blue-700 rounded">Home</Link>
              <Link to="/jobs" className="block px-3 py-2 hover:bg-blue-700 rounded">Jobs</Link>
              <Link to="/resources" className="block px-3 py-2 hover:bg-blue-700 rounded">Resources</Link>
              <Link to="/about" className="block px-3 py-2 hover:bg-blue-700 rounded">About</Link>
              <Link to="/contact" className="block px-3 py-2 hover:bg-blue-700 rounded">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;