import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/authService";

const PublicRoute = ({ component: Component, ...rest }) => {
  if (!Component) return null;

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Redirect to='/transactions' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
