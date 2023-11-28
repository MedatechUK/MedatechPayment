/*
Program     :  Medpaymentdata.js
Description :  Sub program for payment. 
            :  Calling the NMI api program collect.js in index.html
            :  Use CollectJSSection.js for reference
Date        :  16/11/2023
Created By  :  Jelbin
---------------------------------------------------------------------------------------------
TicketNo         Author          Date              ChangeDesc
---------------------------------------------------------------------------------------------
JKB0611         - Jelbin     -  16-11-2023         Created
---------------------------------------------------------------------------------------------*/

import React from "react";

function Medpaymentdata() {
  return (
    <React.Fragment>
      <div id="ccnumber" style={{ width: "89%" }} />
      <br />
      <div
        id="ccexp"
        style={{
          width: "47%",
          display: "inline-block",
          marginRight: "5%",
        }}
      />
      <div id="cvv" style={{ width: "37%", display: "inline-block" }} />
    </React.Fragment>
  );
}
export default Medpaymentdata;
