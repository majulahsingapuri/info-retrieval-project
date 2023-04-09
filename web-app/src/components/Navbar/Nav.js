import React from 'react';
import logo from '../../car2.webp';
import './Nav.css';

const Nav = () => {

  return (
    <div className="car__navbar">
      <div className="car__navbar-links">
        <div className="car__navbar-links_logo">
          <img className="car_logo" src={logo} alt="App-car" />
        </div>
        <div className="car__navbar-links_container">
          <p>Cars</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;
