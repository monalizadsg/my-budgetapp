import React from "react";
import { NavLink } from "react-router-dom";
import { faClipboard, faBullseye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { List, ListItem } from "@material-ui/core";
import "./SideNav.scss";

const navLinks = [
  {
    title: "Transaction",
    path: "/transactions",
    icon: <FontAwesomeIcon className='icon' icon={faClipboard} />,
  },
  {
    title: "Budget",
    path: "/budgets",
    icon: <FontAwesomeIcon className='icon' icon={faBullseye} />,
  },
];

const SideNav = () => {
  return (
    <div className='side-nav-container'>
      <List
        component='nav'
        aria-labelledby='main navigation'
        className='side-navbar'
      >
        {navLinks.map(({ title, path, icon }) => (
          <NavLink to={path} activeClassName='active'>
            <ListItem className='side-navbar-item'>
              {icon} {title}
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  );
};

export default SideNav;
