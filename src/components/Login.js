import React from "react";
import { Grid, Paper, Typography, Button } from "@material-ui/core";
import TextInput from "../components/TextInput";

const Login = () => {
  return (
    <div>
      <Grid container spacing={0} justify='center' direction='row'>
        <Grid item>
          <Grid
            container
            direction='column'
            justify='center'
            spacing={2}
            className='login-form'
          >
            <Paper
              variant='elevation'
              elevation={2}
              className='login-background'
            >
              <Grid item>
                <Typography component='h1' variant='h5'>
                  Sign in
                </Typography>
              </Grid>
              <Grid item>
                <form onSubmit={null}>
                  <Grid container direction='column' spacing={2}>
                    <Grid item>
                      <TextInput
                        type='email'
                        name='email'
                        label='email'
                        value={null}
                        onChange={null}
                        error={null}
                      />
                    </Grid>
                    <Grid item>
                      <TextInput
                        type='password'
                        name='password'
                        label='password'
                        value={null}
                        onChange={null}
                        error={null}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        className='button-block'
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
