import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/index.css'
import MenuIcon from '../images/menu.png';

const Navbar = () => {
    const location = useLocation();

    const adminPaths = 
          location.pathname === '/' || 
          location.pathname === '/AdminDashboard' || 
          location.pathname === '/AdminSettings';

    const universityPaths = 
          location.pathname === '/UniDashboard' || 
          location.pathname === '/UniReservations' ||
          location.pathname === '/UniSettings';

    const rsoPaths = 
          location.pathname === '/RSODashboard' || 
          location.pathname === '/RSOSearch' ||
          location.pathname === '/RSOReservations' ||
          location.pathname === '/RSOSettings';
    
    const studentsPaths = 
          location.pathname === '/StudentsDashboard' || 
          location.pathname === '/StudentsEvents' ||
          location.pathname === '/StudentsMemberships' ||
          location.pathname === '/StudentsSettings' ||
          location.pathname === '/';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    useEffect(() => {
      document.body.addEventListener('click', closeMenu);

      return () => {
        document.body.removeEventListener('click', closeMenu);
      };
    }, []);

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    return (
      <nav className="navbar-container">
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
        <link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@400;700&display=swap" rel="stylesheet"></link>
        <div className="navbar-left-align">
        </div>
        <div className="navbar-right-align">
          <ul className="navbar-links" onClick={stopPropagation} ref={menuRef}>
            <div className="navbar-menu-container">
              <button className="navbar-menu-button" onClick={toggleMenu}>
                <img src={MenuIcon} alt="Menu" className="navbar-icon"/>
              </button>
            </div>
          </ul>
        {isMenuOpen && adminPaths && (
            <div className="navbar-menu">

              <Link to="/AdminDashboard">
                <button className="navbar-menu-text" onClick={toggleMenu}>Admin Dashboard</button>
              </Link>
              <Link to="/AdminSettings">
                <button className="navbar-menu-text" onClick={toggleMenu}>Settings</button>
              </Link>
              <Link to="/">
                <button className="navbar-menu-text" onClick={toggleMenu}>Log Out</button>
              </Link>

            </div>
          )}
          {isMenuOpen && universityPaths && (
            <div className="navbar-menu">

              <Link to="/UniDashboard">
                <button className="navbar-menu-text" onClick={toggleMenu}>Search for Rooms</button>
              </Link>
              <Link to="/UniReservations">
                <button className="navbar-menu-text" onClick={toggleMenu}>Manage Reservations</button>
              </Link>
              <Link to="/UniSettings">
                <button className="navbar-menu-text" onClick={toggleMenu}>Settings</button>
              </Link>
              <Link to="/">
                <button className="navbar-menu-text" onClick={toggleMenu}>Log Out</button>
              </Link>

            </div>
          )}
          {isMenuOpen && rsoPaths && (
            <div className="navbar-menu">

              {/* <Link to="/UniHomePage">
                <button className="navbar-menu-text" onClick={toggleMenu}>Home</button>
              </Link> */}
              <Link to="/RSOSearch">
                <button className="navbar-menu-text" onClick={toggleMenu}>Manage Organizations</button>
              </Link>
              <Link to="/UniReservationsPage">
                <button className="navbar-menu-text" onClick={toggleMenu}>Manage Reservations</button>
              </Link>
              <Link to="/UniSettingsPage">
                <button className="navbar-menu-text" onClick={toggleMenu}>Settings</button>
              </Link>
              <Link to="/">
                <button className="navbar-menu-text" onClick={toggleMenu}>Log Out</button>
              </Link>

            </div>
          )}
        </div>
      </nav>
    );
  };

export default Navbar;