import React, { Component } from "react";

import SideNav from "./common/SideNav";
import "./Main.scss";
import { Switch, Route } from "react-router-dom";
import Transactions from "./transactions/Transactions";

const Main = () => {
  return (
    <div className='main-container'>
      <SideNav />
      <div className='main-body-container'>
        <Switch>
          <Route path='/' component={Transactions} />
        </Switch>
      </div>
    </div>
  );
};

export default Main;
