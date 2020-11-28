import React from "react";
import Header from "../components/Header";
import SideNav from "./../components/SideNav";
import "./AppContainer.scss";

const AppContainer = (props) => {
  return (
    <div className='app-container'>
      <Header />
      <div className='main-wrapper'>
        <SideNav />
        <div className='main-content'>{props.children}</div>
      </div>
    </div>
  );
};

export default AppContainer;
