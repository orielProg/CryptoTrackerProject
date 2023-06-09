import Grid from "@mui/material/Grid";
import { Paper, Typography } from "@mui/material";
import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { Divider } from "@mui/material";
import { TextField, Card, CardHeader, CardContent, Link } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { GoogleLogin } from "react-google-login";
import {
  emailSchema,
  passwordSchema,
  onRefChange,
  initialValidationState,
  usernameSchema,
} from "../validation";

import axios from "axios";

const Register = (props) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [emailFeedback, setEmailFeedback] = useState(initialValidationState);
  const [usernameFeedback, setUsernameFeedback] = useState(
    initialValidationState
  );
  const [passwordFeedback, setPasswordFeedback] = useState(
    initialValidationState
  );
  const [confirmPasswordFeedback, setConfirmPasswordFeedback] = useState(
    initialValidationState
  );

  const submitHandler = async (event) => {
    event.preventDefault();
    if (emailFeedback.error || usernameFeedback.error || passwordFeedback.error)
      return;
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const username = usernameRef.current.value;
    if (password !== confirmPassword) {
      setConfirmPasswordFeedback({
        error: true,
        helper: "The passwords do not match",
      });
      setLoading(false);
      return;
    }
    await axios
      .post("/api/register", {
        username,
        email,
        password,
        confirmPassword,
      })
      .then((res) => navigate("/login"))
      .catch((err) => alert(err.response.data));
    setLoading(false);
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
            title="Register"
            titleTypographyProps={{ variant: "h3", fontWeight: 550 }}
            subheader="Use your email to create a new account"
            subheaderTypographyProps={{ variant: "body1" }}
          ></CardHeader>
          <CardContent>
            <Divider />
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
                id="username"
                label="Username"
                inputRef={usernameRef}
                error={usernameFeedback.error}
                helperText={usernameFeedback.helper}
                onChange={() =>
                  onRefChange(
                    usernameRef,
                    usernameSchema,
                    "username",
                    setUsernameFeedback,
                    usernameFeedback
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
              <TextField
                margin="normal"
                fullWidth
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                inputRef={confirmPasswordRef}
                error={confirmPasswordFeedback.error}
                helperText={confirmPasswordFeedback.helper}
                onChange={() => {
                  if (confirmPasswordFeedback.error)
                    setConfirmPasswordFeedback(initialValidationState);
                }}
              />
            </Grid>
            <Grid container pb={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitHandler}
              >
                Sign up
              </Button>
            </Grid>
            <Typography color="text.secondary">
              Have an account?{" "}
              <Link href="/login" underline="hover">
                Sign In
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Register;
