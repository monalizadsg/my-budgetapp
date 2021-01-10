import React, { useState } from "react";
import { Grid, Paper, Button, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TextInput from "../components/TextInput";
import { login } from "./authService";
import { useHistory } from "react-router-dom";
import "./Login.scss";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    height: 300,
    display: "flex",
    alignItems: "center",
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();
  const classes = useStyles();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setError("Incorrect email or password");
      return;
    }

    try {
      await login(email, password);
      history.push("/transactions");
    } catch (ex) {
      setError("Incorrect email or password");
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

  return (
    <div className='login-wrapper'>
      <Paper variant='elevation' elevation={2}>
        <Container className={classes.container} maxWidth='xs'>
          <form onSubmit={handleSubmit}>
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
                    <TextInput
                      fullWidth
                      type='password'
                      name='password'
                      label='Password'
                      value={password}
                      onChange={handlePasswordChange}
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
                >
                  Login
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Paper>
    </div>
  );
};

export default Login;
