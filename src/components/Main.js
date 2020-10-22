import React, { Component } from "react";
import AppRouter from "../routes/AppRouter";
import SideNav from "./common/SideNav";
import "./Main.scss";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../styles/theme";

const Main = () => {
  return (
    <ThemeProvider theme={theme}>
      {/* <CssBaseline /> */}
      <div className='main-container'>
        <SideNav />
        <div className='main-body-container'>
          <AppRouter />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Main;
