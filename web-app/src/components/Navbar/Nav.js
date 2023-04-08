import React from 'react';
import logo from '../../car2.webp';
import './Nav.css';

const Nav = () => {

  return (
    <div className="car__navbar">
      <div className="car__navbar-links">
        <div className="car__navbar-links_logo">
          <img className="car_logo" src={logo} alt="App-car"/>
        </div>
        <div className="car__navbar-links_container">
          <p>Cars</p>
        </div>
      </div>
    </div>
  );
};

export default Nav;

/* 
const [toggleMenu, setToggleMenu] = useState(false);
<div className="car_navbar-menu">
  {toggleMenu
    ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
    : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
  {toggleMenu && (
  <div className="car__navbar-menu_container scale-up-center">
    <div className="car__navbar-menu_container-links">
      <p><a href="#home">Home</a></p>
      <p><a href="#about">About</a></p>
    </div>
  </div>
  )}
</div>
*/