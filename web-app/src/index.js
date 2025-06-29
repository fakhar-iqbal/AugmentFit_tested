import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthContextProvider from "./contexts/userContext";
import RequireAuth from "./routes/RequireAuth";
import Login from "./pages/login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserDetails from "./pages/userDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <RequireAuth redirectTo={"/login"}>
                <App />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users/:userid"
            element={
              <RequireAuth redirectTo={"/login"}>
                <UserDetails />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
