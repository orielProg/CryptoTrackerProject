import {
  Box,
  Card,
  CardHeader,
  Divider,
  Tooltip,
  AlertTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, useContext, Fragment, useRef } from "react";
import { IconButton, Avatar, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import TokenModal from "./TokenModal";
import { tokensActions } from "../store/tokens";
import {
  uploadAndLoadTokens, getTokens, checkIfCanBeCharted
} from "../store/asyncFunctions";

import { LoadingComp,columns,CustomNoRowsOverlay } from "./tokens_utils";


const Tokens = (props) => {
  const isFirstRun = useRef(true);
  const dispatch = useDispatch();
  const tokens = useSelector((state) => state.tokens.tokens);
  const loading = useSelector((state) => state.tokens.loading);
  const error = useSelector((state) => state.tokens.error);
  const { enqueueSnackbar } = useSnackbar();
  const page = useSelector((state) => state.tokens.page);
  const rowCount = useSelector((state) => state.tokens.rowCount);
  const tokenInfo = useSelector((state) => state.tokens.tokenInfo);
  const sortingModel = useSelector((state) => state.tokens.sortingModel);

  const successFunction = () => {
    enqueueSnackbar("Tokens updated successfully", {
      variant: "success",
    });
  };

  const errorFunction = () => {
    enqueueSnackbar(error, {
      variant: "error",
    });
    dispatch(tokensActions.setError(""));
  };

  const handleClose = () => {
    dispatch(tokensActions.setTokenInfo(null));
  };

  const refreshHandler = async () => {
    if (sortingModel.length === 0) {
      return;
    }
    dispatch(uploadAndLoadTokens(page, 7, rowCount, sortingModel))
    if(error) errorFunction()
    else successFunction()
  };

  useEffect(async () => {
    if (tokens.length === 0) {
      dispatch(uploadAndLoadTokens(page, 7, rowCount, sortingModel))
      if(error) errorFunction()
    }
  }, []);

  useEffect(async () => {
    if(isFirstRun.current){
      isFirstRun.current = false;
      return;
    }
    dispatch(getTokens(page, 7, rowCount, sortingModel));
    if(error) errorFunction()
  }, [page,sortingModel])


  const handleSortModelChange = (newModel) => {
    console.log(newModel);
    dispatch(tokensActions.setSortingModel(newModel));
  };


  return (
    <Fragment>
      <Card sx={{ height: "100%" }}>
        <CardHeader
          title="Tokens"
          titleTypographyProps={{ variant: "h4" }}
          action={
            <Tooltip title="Refresh">
              <IconButton aria-label="refresh">
                <RefreshIcon onClick={refreshHandler} />
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <Box>
          <div style={{ height: "50vh", width: "100%" }}>
            <DataGrid
              disableColumnFilter
              components={{
                LoadingOverlay: LoadingComp,
                NoRowsOverlay: CustomNoRowsOverlay,
              }}
              isRowSelectable={() => false}
              rows={loading ? [] : tokens}
              columns={columns}
              pageSize={7}
              rowsPerPageOptions={[7]}
              sx={{
                border: 0,
                "& .MuiDataGrid-row:hover": {
                  cursor: "pointer",
                },
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
              paginationMode="server"
              loading={loading}
              pagination
              onPageChange={(newPage) =>
                dispatch(tokensActions.setPage(newPage))
              }
              page={page}
              rowCount={rowCount}
              sortingMode="server"
              sortModel={sortingModel}
              onSortModelChange={handleSortModelChange}
              onRowClick={(params, event) => {
                event.defaultMuiPrevented = true;
                event.defaultPrevented = true;
              }}
              onCellClick={(params, event) => {
                event.defaultMuiPrevented = true;
                event.defaultPrevented = true;
              }}
            />
          </div>

          <Alert severity="info" style={{ backgroundColor: "transparent" }}>
            <AlertTitle style={{ color: "white" }}>
              Click on a token to open a chart — <strong>check it out!</strong>
            </AlertTitle>
          </Alert>
        </Box>
      </Card>
      <TokenModal tokenInfo={tokenInfo} handleClose={handleClose} />
    </Fragment>
  );
};

export default Tokens;
