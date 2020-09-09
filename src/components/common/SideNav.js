import React, { Component } from "react";
import { Link } from "react-router-dom";
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
            <Link to='/transactions' className='side-nav-link'>
              <FontAwesomeIcon className='icon' icon={faClipboard} />
              Transactions
            </Link>
          </li>
          <li className='side-navbar-item'>
            <Link to='/transactions' className='side-nav-link'>
              <FontAwesomeIcon className='icon' icon={faBullseye} />
              Budget
            </Link>
          </li>
          <li className='side-navbar-item'>
            <Link to='/transactions' className='side-nav-link'>
              <FontAwesomeIcon className='icon' icon={faCog} />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;
