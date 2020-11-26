import React from "react";
import Header from "../components/Header";

const AppContainer = (props) => {
  return (
    <div className='app-container'>
      <Header />
      {props.children}
    </div>
  );
};

export default AppContainer;
