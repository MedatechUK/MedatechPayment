/*
Program     :  Medatechpay.js
Description :  Main program for  Medatech payment. 
            :  Calling the NMI api program collect.js in index.html
            :  Use the standared functions from the collect.js for payment token creation 
            :  use InlineCartPage.js for reference
Date        :  16/11/2023
Created By  :  Jelbin
---------------------------------------------------------------------------------------------
TicketNo         Author          Date              ChangeDesc
---------------------------------------------------------------------------------------------
JKB0611         - Jelbin     -  16-11-2023         Createdd
---------------------------------------------------------------------------------------------*/
import React, { useState, useEffect } from "react";
import { TableBody, TableRow, Button, TableCell } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Medpaymentdata from "./Medpaymentdata";
import MainService from "../service/MainService"; 
import { Paper, Table } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; 
import ErrorIcon from "@mui/icons-material/Error"; 
import { useSnackbar } from "notistack";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useParams } from 'react-router-dom';

const useStyles = makeStyles({
  tableLeft: {
    position: "relative",
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  customTableCell: {
    padding: "0px",
    border: "none",
  },
});

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright "}
      <Link color="#1976d2" href="https://medatechuk.com/">
        © Medatech UK
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    red: theme.palette.augmentColor({
      color: {
        main: "#C00932",
      },
      name: "red",
    }),
  },
});

function Medatechpay() {
  const [formData, setFormData] = useState({
    cardName: "",
    amount: "",
    isSubmitting: false,
  });

  const [cardNameval, setcardNameval] = useState("");
  const [paymentProcess, setPaymentProcess] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  //const [paymentFailed, setPaymentFailed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const classes = useStyles();

  const [transactionID, setTransactionID] = useState(0);
  const [responseText, setResponseText] = useState("");
  const [saleOrderNumber, setsaleOrderNumber] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { customer } = useParams();

  useEffect(() => {
    //step 1-pageload
    window.CollectJS.configure({
      variant: "inline",
      styleSniffer: true,
      callback: (token) => {
        //Step3
        finishSubmit(token);
      },
      fields: {
        ccnumber: {
          placeholder: "Card Number",
          selector: "#ccnumber",
        },
        ccexp: {
          placeholder: "Card Expiration",
          selector: "#ccexp",
        },
        cvv: {
          placeholder: "CVV",
          selector: "#cvv",
        },
      },
    });
  }, []);

  useEffect(() => {
    if (paymentResponse !== "") {
      //sample respose from NMI API
      //response=1&responsetext=SUCCESS&authcode=123456&transactionid=8896807088&avsresponse=&cvvresponse=N&
      //orderid=&type=&response_code=100&amount_authorized=3064.00&subscription_id=&recurring=&customer_vault_id=&
      //three_ds_version=&eci=&directory_server_id=&cc_number=4xxxxxxxxxxx2925&cc_exp=1223
      const payloadURL = new URLSearchParams(paymentResponse);
      const response_Text = payloadURL.get("responsetext");
      setResponseText(response_Text);

      if (response_Text === "SUCCESS") {
        const transaction_ID = payloadURL.get("transactionid");
        setTransactionID(transaction_ID);
        setPaymentSuccess(true);
      } else {
        setPaymentSuccess(false);
      }
      setPaymentStatus(true);
      setPaymentProcess(false);
    }
  }, [paymentResponse]);

  useEffect(() => {
    setcardNameval(cardNameval);
  }, [cardNameval]);

  
  const handleSubmit = (event) => {
    setPaymentProcess(true);
    event.preventDefault();
    // start payment.
    setFormData({ ...formData });
    window.CollectJS.startPaymentRequest(); //Step2
  };

  const handlePOSTpayment = (payment_token) => {
    const payment_payload = {
      CARDNAME: cardNameval,
      AMOUNT: 20, //paymentTotal.substring(1),
      PAYMENTTOKEN: payment_token,
      SECURITY_KEY: "TFT8C2eyD4MF956r33Kx727avGW6d3Rt",
    };
   MainService.postPyament(payment_payload)
      .then((response) => {
        setPaymentResponse(response.data);
      })
      .catch((err) => {
        console.log(err);
      }); 
  };

  //step 4
  const finishSubmit = (response) => {
    const { isSubmitting, ...updatedFormData } = { ...formData };
    updatedFormData.token = response.token;
    handlePOSTpayment(response.token);
    setFormData({
      ...updatedFormData,
      isSubmitting: false,
    });
  };

  return (
    <div className="App">
      <h2>Payment for Customer: {customer}</h2>
      <br />
      {paymentStatus === false ? (
        <Paper elevation={5} style={{ marginLeft: "25%", width: "42%" }}>
          <Table style={{ backgroundColor: "#1976d2" }}>
            <TableBody>
              {" "}
              <TableRow>
                <TableCell>
                  <b style={{ fontSize: "20px" }}>Payment Checkout:</b>
                </TableCell>
                <TableCell style={{ textAlign: "right" }}>
                  {/*  <b style={{ fontSize: "25px" }}>{paymentTotal}</b> */}
                  <b style={{ fontSize: "25px" }}>25</b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <Table className={classes.tableLeft}>
            <TableBody>
              <TableRow>
                <div>
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Card Name"
                    style={{
                      width: "88%",
                      height: "30px",
                    }}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        cardName: event.target.value,
                      })
                    }
                    value={formData.cardName}
                  />
                </div>
                <br />
                <Medpaymentdata />
                <br />
                <Button
                  onClick={handleSubmit}
                  sx={{ mt: 1, marginBottom: "10px", width: "89%" }}
                  variant="contained"
                  disabled={formData.cardName === ""}
                >
                  Submit Payment
                </Button>
              </TableRow>
            </TableBody>
          </Table>
          {paymentProcess ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell style={{ color: "red" }}>
                    <CircularProgress style={{ color: "red" }} />
                    &nbsp; &nbsp;Payment is in processing...Do not refresh the
                    page
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <></>
          )}
        </Paper>
      ) : (
        <></>
      )}

      {paymentStatus ? (
        <Paper elevation={5} style={{ marginLeft: "25%", width: "42%" }}>
          <Table>
            {paymentSuccess ? (
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <TableRow
                  style={{
                    fontSize: "20px",
                    color: "green",
                    marginTop: "50%",
                  }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  <CheckCircleOutlineIcon />
                  &nbsp;Your payment is successful.Thank you for your purchase.{" "}
                </TableRow>
              </div>
            ) : (
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <TableRow style={{ fontSize: "20px", color: "red" }}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <ErrorIcon /> 
                  &nbsp;Sorry!..Your Payment Failed!{" "}
                </TableRow>
              </div>
            )}
          </Table>
          <Table>
            <TableRow>
              <TableCell>
                &nbsp;&nbsp;&nbsp;&nbsp;<b>Response:</b>
              </TableCell>
              <TableCell>
                <b>{responseText}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                &nbsp;&nbsp;&nbsp;&nbsp;<b>Transaction ID:</b>
              </TableCell>
              <TableCell>
                <b>{transactionID}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                &nbsp;&nbsp;&nbsp;&nbsp;<b>Amount:</b>
              </TableCell>
              <TableCell>{/* <b>{paymentTotal}</b> */}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                &nbsp;&nbsp;&nbsp;&nbsp;<b>Date:</b>
              </TableCell>
              <TableCell>
                <b>{new Date().toLocaleString()}</b>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                &nbsp;&nbsp;&nbsp;&nbsp;<b>Order ID:</b>
              </TableCell>
              <TableCell>
                <b>{saleOrderNumber}</b>
              </TableCell>
            </TableRow>
          </Table>
        </Paper>
      ) : (
        <></>
      )}

      <Paper style={{ marginTop: "8%", marginLeft: "25%", width: "42%" }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  backgroundImage:
                    "url(https://www.bloorresearch.com/wp-content/uploads/2016/01/medatech-transparent-logo.png)",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: (t) =>
                    t.palette.mode === "light"
                      ? t.palette.grey[50]
                      : t.palette.grey[900],
                  backgroundSize: "50%",
                  height: "100px",
                  backgroundPosition: "center",
                }}
              ></TableCell>
            </TableRow>
            <Copyright sx={{ mt: 1 }} />
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
export default Medatechpay;
