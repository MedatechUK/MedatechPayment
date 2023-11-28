import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Medatechpay from "./components/Medatechpay";

function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/payments" element={<Medatechpay />} />
          <Route path="/payments/:customer" element={<Medatechpay />} />
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
