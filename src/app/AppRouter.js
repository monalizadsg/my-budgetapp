import React from "react";
import { Switch, Route } from "react-router-dom";
import Transactions from "../transactions/Transactions";
import Budget from "../budget/Budget";
import Login from "../components/Login";
import Main from "../components/Main";

const AppRouter = () => {
  return (
    <Switch>
      <Route path='/budget' component={Budget} />
      <Route path='/' component={Transactions} />
      <Route exact path='/' component={Main} />
      <Route exact path='/login' component={Login} />
    </Switch>
  );
};

export default AppRouter;
