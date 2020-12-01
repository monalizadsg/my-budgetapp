import React from "react";
import { Switch } from "react-router-dom";
import Login from "../auth/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Transactions from "./../transactions/Transactions";
import Budget from "./../budget/Budget";
import Signup from "./../auth/Signup";

const AppRouter = () => {
  return (
    <Switch>
      <PrivateRoute exact component={Transactions} path='/' />
      <PrivateRoute component={Transactions} path='/transactions' />
      <PublicRoute exact component={Login} path='/login' />
      <PublicRoute exact component={Signup} path='/signup' />
      <PrivateRoute exact component={Budget} path='/budgets' />
    </Switch>
  );
};

export default AppRouter;
