import { Paper, Grid, CardContent, IconButton } from "@mui/material";
import { Typography, Link } from "@mui/material";
import GoogleLogin from "react-google-login";
import { Divider, Card, CardHeader, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { TextField } from "@mui/material";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../App";
import GoogleIcon from "@mui/icons-material/Google";
import {
  emailSchema,
  passwordSchema,
  onRefChange,
  initialValidationState,
} from "../validation";

const Login = (props) => {
  const CLIENT_ID =
    "834909978091-sslbqe75fus3a11bqo4t055jeg69ev28.apps.googleusercontent.com";
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [emailFeedback, setEmailFeedback] = useState(initialValidationState);
  const [passwordFeedback, setPasswordFeedback] = useState(
    initialValidationState
  );
  const navigate = useNavigate();
  const context = useContext(LoggedInContext);

  const submitHandler = async (event) => {
    event.preventDefault();
    if (emailFeedback.error || passwordFeedback.error) return;
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    await axios
      .post("/api/login", {
        email,
        password,
      })
      .then(() => context.setLoggedIn(true))
      .catch((err) => alert(err.response.data));
    setLoading(false);
  };

  const googleLogin = async (res) => {
    await axios
      .post("/api/google-login", {
        googleID: res.googleId,
        email: res.profileObj.email,
        picture: res.profileObj.imageUrl,
      })
      .then(() => context.setLoggedIn(true))
      .catch((err) => alert(err.response.data));
  };

  return (
    <Grid
      container
      justifyContent={"center"}
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <Grid item xs={3.5}>
        <Card>
          <CardHeader
            title="Sign in"
            titleTypographyProps={{ variant: "h3", fontWeight: 550 }}
            subheader="Sign in to CryptoTracker platform"
            subheaderTypographyProps={{ variant: "body1" }}
          ></CardHeader>
          <CardContent>
            <GoogleLogin
              clientId={CLIENT_ID}
              cookiePolicy={"single_host_origin"}
              onSuccess={(res) => googleLogin(res)}
              onFailure={(res) => console.log(res)}
              render={(renderProps) => (
                <Grid container justifyContent={"center"} pb={3}>
                  <Grid item xs={8}>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      color="error"
                      startIcon={<GoogleIcon />}
                      onClick={renderProps.onClick}
                    >
                      Login with Google account
                    </Button>
                  </Grid>
                </Grid>
              )}
            />

            <Divider>or login with email address</Divider>
            <Grid container pt={2} pb={2}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                inputRef={emailRef}
                error={emailFeedback.error}
                helperText={emailFeedback.helper}
                onChange={() =>
                  onRefChange(
                    emailRef,
                    emailSchema,
                    "email",
                    setEmailFeedback,
                    emailFeedback
                  )
                }
              />
              <TextField
                margin="normal"
                fullWidth
                type="password"
                id="password"
                label="Password"
                inputRef={passwordRef}
                error={passwordFeedback.error}
                helperText={passwordFeedback.helper}
                onChange={() =>
                  onRefChange(
                    passwordRef,
                    passwordSchema,
                    "password",
                    setPasswordFeedback,
                    passwordFeedback
                  )
                }
              />
            </Grid>
            <Grid container pb={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitHandler}
              >
                Sign In
              </Button>
            </Grid>
            <Grid container justifyContent="space-between">
            <Grid item>
                <Typography variant="body2" color="text.secondary">
                  
                  <Link href="/password-reset" underline="hover">
                    Forgot password?
                  </Link>
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link href="/register" underline="hover">
                    Sign Up
                  </Link>
                </Typography>
              </Grid>
              
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;
