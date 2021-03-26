import React, { useState } from "react";
import { Grid, Paper, Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import TextInput from "../components/TextInput";
import { makeStyles } from "@material-ui/core/styles";
import piggy from "../images/piggy.svg";
import "./Signup.scss";
import TextInputWithIcon from "../components/TextInputWithIcon";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  welcomeDisplay: {
    padding: theme.spacing(3),
    height: 500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const Signup = () => {
  const classes = useStyles();
  const initialUserInput = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [user, setUser] = useState(initialUserInput);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState({});

  const handleInputChange = ({ target: input }) => {
    const { name, value } = input;
    setUser({ ...user, [name]: value });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      // await login(email, password);
      // history.push("/");
      alert(
        `Registered! ${user.firstName} ${user.lastName} ${user.email} ${user.password}`
      );
    } catch (ex) {
      // setError("Incorrect email or password");
    }
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (user.firstName === "") {
      errors.firstName = "This field is required.";
    }
    if (user.lastName === "") {
      errors.lastName = "This field is required";
    }
    if (user.email === "") {
      errors.email = "This field is required";
    }
    if (user.password === "") {
      errors.password = "This field is required";
    }
    if (user.confirmPassword === "") {
      errors.confirmPassword = "This field is required";
    } else if (user.confirmPassword !== user.password) {
      errors.confirmPassword = "Passwords does not match";
    }

    if (Object.keys(errors).length > 0) {
      isValid = false;
    }

    setError(errors);

    return isValid;
  };

  return (
    <div className='signup-wrapper'>
      <div className='welcome'>
        <Container className={classes.welcomeDisplay} maxWidth='xs'>
          <Typography variant='h4' className='title'>
            Welcome to HomeExpensify
          </Typography>
          <Typography variant='body1' className='detail'>
            Track all your expenses and manage your budgets!
          </Typography>
          <img src={piggy} width='400px' alt='Piggy bank' className='image' />
        </Container>
      </div>
      <div className='form'>
        <Paper variant='elevation' elevation={2}>
          <Container className={classes.container} maxWidth='xs'>
            <Grid item xs={12} className='header'>
              <Typography variant='h4' className='title'>
                Create your account
              </Typography>
              <Typography variant='body1' className='description'>
                Already have an account?{" "}
                <span className='link'>
                  <Link to='/login'>Sign in</Link>
                </span>
              </Typography>
            </Grid>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextInput
                        fullWidth
                        name='firstName'
                        label='First Name'
                        value={user.firstName}
                        onChange={handleInputChange}
                        error={error.firstName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        fullWidth
                        name='lastName'
                        label='Last Name'
                        value={user.lastName}
                        onChange={handleInputChange}
                        error={error.lastName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInput
                        fullWidth
                        type='email'
                        name='email'
                        label='Email'
                        value={user.email}
                        onChange={handleInputChange}
                        error={error.email}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputWithIcon
                        label='Password'
                        name='password'
                        showPassword={showPassword}
                        value={user.password}
                        onChange={handleInputChange}
                        onClick={handleClickShowPassword}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextInputWithIcon
                        label='Confirm Password'
                        name='confirmPassword'
                        showPassword={showConfirmPassword}
                        value={user.confirmPassword}
                        onChange={handleInputChange}
                        onClick={handleClickShowConfirmPassword}
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
                    disabled='true'
                  >
                    Sign Up
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Container>
        </Paper>
      </div>
    </div>
  );
};

export default Signup;
