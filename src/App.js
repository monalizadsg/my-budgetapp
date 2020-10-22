import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import Header from "./components/common/Header";
import Main from "./components/Main";
import Transactions from "./components/transactions/Transactions";

function App() {
  return (
    <React.Fragment>
      <Header />
      <Main />
      {/* <Switch>
        <Route path='/' exact component={Main} />
      </Switch> */}
    </React.Fragment>
  );
}

export default App;
