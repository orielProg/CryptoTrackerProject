import { useSnackbar } from "notistack";
import { useState, useRef, useEffect } from "react";
import {
  Grid,
  Card,
  CardHeader,
  TextField,
  CardContent,
  Link,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import {
  passwordSchema,
  onRefChange,
  initialValidationState,
} from "../validation";

import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const PasswordRecover = (props) => {
  const { id, token } = useParams();
  const [allowed, setAllowed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [passwordFeedback, setPasswordFeedback] = useState(
    initialValidationState
  );
  const navigate = useNavigate();

    useEffect(() => {
      async function fetchResetPassword() {
        const url = "/password-reset/" + id + "/" + token;
      try {
        await axios.get(url);
        setAllowed(true);
      } catch (error) {
        if (error.response && error.response.data)
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        else enqueueSnackbar(error.message, { variant: "error" });
      }
      }
      fetchResetPassword();
    }, [setAllowed]);

  const submitHandler = async () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return;
    }
    try {
      await axios.post("/change-password", {
        password,
        confirmPassword,
        token,
        userID: id,
      });
      enqueueSnackbar("Password updated successfully", { variant: "success" });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data)
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      else enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  if (allowed)
    return (
      <Grid
        container
        xs={12}
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
              title="Password reset"
              titleTypographyProps={{ variant: "h3", fontWeight: 550 }}
              subheader="Reset your password to CryptoTracker platform"
              subheaderTypographyProps={{ variant: "body1" }}
            ></CardHeader>

            <CardContent>
              <Divider />
              <Grid container pt={2} pb={2}>
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
                />
              </Grid>
              <Grid container pb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={submitHandler}
                >
                  Change password
                </Button>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
    else return <div></div>;
};

export default PasswordRecover;
