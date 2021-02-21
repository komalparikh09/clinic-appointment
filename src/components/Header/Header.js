import React from 'react';
import { NavLink } from 'react-router-dom';

import './Header.css';

const header = props => {
  let links = (
    <ul className="main-header__nav-items">
      <li className="main-header__nav-item">
        <NavLink to="/home">Home</NavLink>
      </li>
      <li className="main-header__nav-item">
        <NavLink to="/doctor/add">Doctor Registration</NavLink>
      </li>
      {/* <li className="main-header__nav-item">
        <NavLink to="/doctors">Doctor Dashboard</NavLink>
      </li> */}
      <li className="main-header__nav-item">
        <NavLink to="/doctordashboard">Doctor Dashboard</NavLink>
      </li>
      <li className="main-header__nav-item">
        <NavLink to="/patients">Patient Dashboard</NavLink>
      </li>
      <li className="main-header__nav-item">
        {/* <NavLink to="/appointment/book">Book Appointment</NavLink> */}
        <NavLink to="/appointment">Book Appointment</NavLink>
      </li>
      {/* <li className="main-header__nav-item">
        <NavLink to="/appointment">Search Doctors</NavLink>
      </li>
      <li className="main-header__nav-item">
        <NavLink to="/appointment/doctors">Doctor Dashboard</NavLink>
      </li>
      <li className="main-header__nav-item">
        <NavLink to="/appointment/patients">Patient Dashboard</NavLink>
      </li> */}
      {/* <li className="main-header__nav-item">
        <button onClick={props.onLogout}>Logout</button>
      </li> */}
    </ul>
  );

  if (!props.authenticated) {
    links = (
      <ul className="main-header__nav-items">
        <li className="main-header__nav-item">
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      </ul>
    );
  }

  return (
    <header className="main-header sticky">
      <nav className="main-header__nav">{links}</nav>
    </header>
  );
};

export default header;
