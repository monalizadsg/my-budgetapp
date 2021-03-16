import React, { useState } from "react";
import { Grid, Paper, Button, Container, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextInput from "../components/TextInput";
import { Link } from "react-router-dom";
import { login } from "./authService";
import { useHistory } from "react-router-dom";
import piggyBank from "../images/piggy_bank.png";
import "./Login.scss";
import LoadingWithBackdrop from "../components/LoadingWithBackdrop";

import TextInputWithIcon from "../components/TextInputWithIcon";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    height: 300,
    display: "flex",
    alignItems: "center",
  },
  welcomeDisplay: {
    padding: theme.spacing(3),
    height: 450,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setError("Incorrect email or password");
      return;
    }

    try {
      await login(email, password);
      setIsLoading(false);
      history.push("/transactions");
    } catch (ex) {
      setError("Incorrect email or password");
      setIsLoading(false);
    }
  };

  const handleOnkeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit(event);
    }
  };

  const handleEmailChange = ({ target }) => {
    setEmail(target.value);
  };

  const handlePasswordChange = ({ target }) => {
    setPassword(target.value);
  };

  const validateForm = () => {
    if (email === "" || password === "") {
      setError("Incorrect email or password");
      return false;
    }

    return true;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseLoading = () => {
    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <div className='login'>
        <LoadingWithBackdrop open={isLoading} onClose={handleCloseLoading} />
        <div className='header'>
          <Typography variant='h6' className='logo'>
            HomeExpensify
          </Typography>
          <div className='no-account'>
            Dont have an account?
            <span>
              {" "}
              <Link to='/signup' className='link'>
                Create account
              </Link>
            </span>
          </div>
        </div>
        <div className='login-wrapper'>
          <div className='form'>
            <Typography variant='body1' className='title'>
              Welcome back!
            </Typography>
            <Paper variant='elevation' elevation={2}>
              <Container className={classes.container} maxWidth='xs'>
                <form onSubmit={handleSubmit} onKeyDown={handleOnkeyDown}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextInput
                            fullWidth
                            type='email'
                            name='email'
                            label='Email'
                            value={email}
                            onChange={handleEmailChange}
                            error={error}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextInputWithIcon
                            showPassword={showPassword}
                            value={password}
                            onChange={handlePasswordChange}
                            onClick={handleClickShowPassword}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        color='primary'
                        fullWidth
                        type='submit'
                        variant='contained'
                        disabled={isLoading}
                      >
                        {!isLoading ? "Login" : "Logging in "}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Container>
            </Paper>
          </div>

          <div className='image-container'>
            <Container className={classes.welcomeDisplay} maxWidth='xs'>
              <img
                src={piggyBank}
                width='400px'
                alt='Piggy bank'
                className='image'
              />
            </Container>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
