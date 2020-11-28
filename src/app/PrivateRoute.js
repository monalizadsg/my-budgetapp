import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/authService";
import AppContainer from "./AppContainer";

const PrivateRoute = ({ component: Component, ...rest }) => {
  if (!Component) return null;

  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <AppContainer>
            <Component {...props} />
          </AppContainer>
        ) : (
          <Redirect to='/login' />
        )
      }
    />
  );
};

export default PrivateRoute;
