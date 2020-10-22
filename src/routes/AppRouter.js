import React from "react";
import { Switch, Route } from "react-router-dom";
import Transactions from "../components/transactions/Transactions";
import Budget from "../components/budget/Budget";

const AppRouter = () => {
  return (
    <Switch>
      <Route path='/budget' component={Budget} />
      <Route path='/' component={Transactions} />
    </Switch>
  );
};

export default AppRouter;
