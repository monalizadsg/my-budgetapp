import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Main from "./components/Main";
import Transactions from "./components/transactions/transactions";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route path='/' exact component={Main} />
        <Route path='/transactions' component={Transactions} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
