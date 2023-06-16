import {
  Grid,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Fragment, useState } from "react";
import UpperbarSettings from "./UpperbarSettings";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import WalletsList from "./WalletsList";
import axios from "axios";
import { useEffect, useContext } from "react";
import { LoggedInContext } from "../App";
import { useSnackbar } from "notistack";
import { TailSpin } from "react-loader-spinner";
import { tokensActions } from "../store/tokens";
import {
  uploadAndLoadTokens, getTokens, checkIfCanBeCharted
} from "../store/asyncFunctions";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const btcRegex = new RegExp(
  "\\b(bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|[13][a-km-zA-HJ-NP-Z1-9]{25,35})\\b"
);

const EditWallets = (props) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const walletRef = useRef("");
  const [walletsData, setWalletsData] = useState([]);
  const [selected, setSelected] = useState([]);
  const context = useContext(LoggedInContext);
  const rowCount = useSelector((state) => state.tokens.rowCount);
  const sortingModel = useSelector((state) => state.tokens.sortingModel);
  const page = useSelector((state) => state.tokens.page);

  const handleToggle = (event) => {
    const value = event.currentTarget.id;
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    async function updateWalletsFunc() {
      if (walletsData.length !== 0) return;
    await axios
      .get("/api/app/get-wallets")
      .then((data) => {
        setWalletsData(data.data);
      })
      .catch((err) =>
        enqueueSnackbar(err.message, {
          variant: "error",
        })
      );
    setLoading(false);
    }
    updateWalletsFunc();
  }, []);

  const updateWallets = async () => {
    await axios
      .post("/api/app/change-wallets", { wallets: walletsData })
      .then(() => {
        enqueueSnackbar("Wallets updated successfully!", {
          variant: "success",
        });
        dispatch(uploadAndLoadTokens(page, 7, rowCount, sortingModel))
      })
      .catch((error) => {
        if (error.response && error.response.data)
          enqueueSnackbar(error.response.data.message, { variant: "error" });
        else enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  const closeHandler = () => {
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  const deleteWalletsHandler = () => {
    setSelected([]);
    setWalletsData(walletsData.filter((wallet) => !selected.includes(wallet)));
  };

  const addWalletHandler = () => {
    const newWallet = walletRef.current.value;
    walletRef.current.value = "";
    if (walletsData.includes(newWallet)) {
      enqueueSnackbar("Error : This wallet already exist", {
        variant: "error",
      });
      return;
    }
    if (
      /^(0x){1}[0-9a-fA-F]{40}$/i.test(newWallet) ||
      btcRegex.test(newWallet)
    ) {
      setWalletsData([...walletsData, newWallet]);
      closeHandler();
    } else
      enqueueSnackbar("Error : Please type a valid wallet address", {
        variant: "error",
      });
  };

  return (
    <Fragment>
      <Grid container >
        <Grid container justifyContent="center">
          <Grid item xs={5}>
            <Card>
              <CardHeader
                subheader="Manage your wallets"
                titleTypographyProps={{ variant: "h5" }}
                title="Wallets"
                action={
                  <IconButton aria-label="add" onClick={openHandler}>
                    <AddIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                {!loading && (
                  <WalletsList
                    handleToggle={handleToggle}
                    wallets={walletsData}
                    setWalletsData={setWalletsData}
                    selected={selected}
                  />
                )}
                {loading && (
                  <Grid container justifyContent="center">
                    <Grid item>
                      <TailSpin
                        height="100"
                        width="100"
                        color="blue"
                        ariaLabel="loading"
                      ></TailSpin>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
              <Divider />
              <Grid container  justifyContent="right">
                <Grid item padding={1}>
                  <Button variant="contained" onClick={deleteWalletsHandler}>
                    Delete selected wallets
                  </Button>
                </Grid>
                <Grid item padding={1}>
                  <Button variant="contained" onClick={updateWallets}>
                    Save & Update
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Grid container justifyContent="center" style={style}>
          <Grid item xs={5}>
            <Card>
              <CardHeader
                title="Add a new wallet"
                titleTypographyProps={{ variant: "h5" }}
                action={
                  <IconButton aria-label="add" onClick={closeHandler}>
                    <CloseIcon />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <TextField
                  margin="normal"
                  fullWidth
                  type="wallet"
                  id="wallet"
                  label="Wallet Address"
                  inputRef={walletRef}
                />
              </CardContent>
              <Divider />
              <Grid container justifyContent="right">
                <Grid item padding={1}>
                  <Button
                    variant="contained"
                    style={{ float: "right" }}
                    onClick={addWalletHandler}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Modal>
    </Fragment>
  );
};

export default EditWallets;
