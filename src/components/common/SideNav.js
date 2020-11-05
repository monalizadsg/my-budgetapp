import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  faClipboard,
  faBullseye,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./SideNav.scss";

const SideNav = () => {
  return (
    <div className='side-nav-container'>
      <nav className='side-navbar'>
        <ul className='side-navbar-list'>
          <li className='side-navbar-item'>
            <NavLink exact to='/' activeClassName='active'>
              <FontAwesomeIcon className='icon' icon={faClipboard} />
              Transactions
            </NavLink>
          </li>
          <li className='side-navbar-item'>
            <NavLink to='/budget' activeClassName='active'>
              <FontAwesomeIcon className='icon' icon={faBullseye} />
              Budget
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
