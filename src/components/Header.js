import React from "react";
import { Link } from "react-router-dom";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";

const Header = () => {
  return (
    <div className='header-container'>
      <header className='header'>
        <nav className='navbar'>
          {/* <Link to='/'>BudgetApp</Link> */}
          <h5 className='navbar-brand'>BudgetApp</h5>
          <ul className='navbar-list'>
            <Link to='/login'>
              <li className='navbar-item'>
                <FontAwesomeIcon icon={faUserCircle} style={{ color: "red" }} />
              </li>
            </Link>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
