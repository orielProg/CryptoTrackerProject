import {
  Grid,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { useRef, useState } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";


const initialValidationState = {
  error: false,
  helper: "",
};
const ChangePassword = (props) => {
  const oldPasswordRef = useRef("");
  const { enqueueSnackbar} = useSnackbar();
  const newPasswordRef = useRef("");
  const newPasswordConfirmRef = useRef("");
  const [oldPasswordValidation, setOldPasswordValidation] = useState(
    initialValidationState
  );
  const [newPasswordValidation, setNewPasswordValidation] = useState(
    initialValidationState
  );
  const [newPasswordConfirmValidation, setNewPasswordConfirmValidation] =
    useState(initialValidationState);

  const submitHandler = async () => {
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const newPasswordConfirm = newPasswordConfirmRef.current.value;
    let errorFlag = false;
    if (newPasswordConfirm !== newPassword) {
      setNewPasswordConfirmValidation({
        error: true,
        helper: "The passwords do not match",
      });
      errorFlag = true;
    } else setNewPasswordConfirmValidation({ ...initialValidationState });
    if (newPassword.length < 6) {
      setNewPasswordValidation({
        error: true,
        helper: "Please type a password with at least 6 characters",
      });
      errorFlag = true;
    } else setNewPasswordValidation({ ...initialValidationState });
    if (errorFlag) return;
    await axios
      .post("/api/app/change-password", { oldPassword, newPassword })
      .then(() => {
        setNewPasswordConfirmValidation({ ...initialValidationState });
        setNewPasswordValidation({ ...initialValidationState });
        setOldPasswordValidation({...initialValidationState})
        oldPasswordRef.current.value = "";
        newPasswordRef.current.value = "";
        newPasswordConfirmRef.current.value = "";
        enqueueSnackbar("Password updated successfully!", {
          variant: "success",
        });
      })
      .catch((err) => {
        errorFlag = true;
        if (
          err &&
          err.response &&
          err.response.data === "Old password is wrong"
        )
          setOldPasswordValidation({
            error: true,
            helper: "Old password is wrong",
          });
          else enqueueSnackbar(err.message, {
            variant: "error",
          })
      });
  };
  return (
    <Grid container pt={3} pb = {3}>
      <Grid container justifyContent="center">
        <Grid item xs={5}>
          <Card>
            <CardHeader titleTypographyProps={{variant : "h5"}} subheader="Update your password" title="Password" />
            <Divider />
            <CardContent>
              <TextField
                margin="normal"
                fullWidth
                type="password"
                id="oldPassword"
                label="Old Password"
                inputRef={oldPasswordRef}
                helperText={oldPasswordValidation.helper}
                error={oldPasswordValidation.error}
              />
              <TextField
                margin="normal"
                fullWidth
                type="password"
                id="newPassword"
                label="New Password"
                inputRef={newPasswordRef}
                helperText={newPasswordValidation.helper}
                error={newPasswordValidation.error}
              />
              <TextField
                margin="normal"
                fullWidth
                type="password"
                id="newPasswordConfirm"
                label="Confirm New Password"
                inputRef={newPasswordConfirmRef}
                helperText={newPasswordConfirmValidation.helper}
                error={newPasswordConfirmValidation.error}
              />
            </CardContent>
            <Divider />
            <Grid container justifyContent="right">
              <Grid item padding={1}>
                <Button variant="contained" onClick={submitHandler}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChangePassword;
