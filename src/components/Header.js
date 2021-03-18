import React from "react";
import { useHistory } from "react-router-dom";
import { logout } from "../auth/authService";
import {
  Container,
  AppBar,
  List,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import "./Header.scss";

const useStyles = makeStyles((theme) => ({
  navbarDisplayFlex: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "65%",
    margin: "auto",
    padding: "0",
  },
  logoText: {
    textDecoration: "none",
    color: theme.palette.primary,
    fontWeight: 500,
  },
  appBar: {
    backgroundColor: "#FAFAFA",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const Header = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    history.push("/login");
  };

  return (
    <>
      <AppBar position='static' className={classes.appBar}>
        <Container
          maxWidth={false}
          className={`nav-header ${classes.navbarDisplayFlex}`}
        >
          <Typography variant='h6' className={classes.logoText}>
            HomeExpensify
          </Typography>
          <List component='nav' aria-labelledby='main navigation'>
            <AccountCircleIcon
              fontSize='large'
              color='primary'
              onClick={handleClick}
            />
            <StyledMenu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </StyledMenu>
          </List>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
