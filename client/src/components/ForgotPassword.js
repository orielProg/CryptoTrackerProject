import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  Divider,
  Button,
  Link,
  Typography,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useRef,useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import LoadingButton from "@mui/lab/LoadingButton";

const ForgotPassword = (props) => {
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const emailRef = useRef();
  const { enqueueSnackbar } = useSnackbar();

  const submitHandler = async () => {
      setLoading(true);
    const email = emailRef.current.value;
    try {
      await axios.post("/password-reset", { email });
      enqueueSnackbar("Recovery email sent", { variant: "success" });
    } catch (error) {
      if (error.response && error.response.data)
        enqueueSnackbar(error.response.data.message, { variant: "error" });
      else enqueueSnackbar(error.message, { variant: "error" });
    }
    setLoading(false);
  };
  const backHandler = () => {
    navigate("/login");
  };

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
          <Grid item xs={12}>
            <IconButton onClick={backHandler}>
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <CardHeader
            title="Recover Password"
            titleTypographyProps={{ variant: "h3", fontWeight: 550 }}
            subheader="Enter an email address where we can send you recovery link"
            subheaderTypographyProps={{ variant: "body1" }}
          ></CardHeader>
          <CardContent>
            <Divider />
            <Grid container xs={12} pt={2} pb={2}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                inputRef={emailRef}
              />
            </Grid>
            <Grid container pb={2}>
              <LoadingButton
                variant="contained"
                color="primary"
                fullWidth
                onClick={submitHandler}
                loading = {loading}
              >
                Recover
              </LoadingButton>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
