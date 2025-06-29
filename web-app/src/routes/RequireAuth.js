import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/userContext";

function RequireAuth({ children, redirectTo }) {
  const { checkAuth } = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    checkAuth()
      .then((res) => {
        setIsLoggedIn(res);
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  }, [checkAuth]);

  if (isLoggedIn == null) {
    return null;
  } else if (!isLoggedIn) {
    return <Navigate to={redirectTo} />;
  } else {
    return children;
  }
}

export default RequireAuth;
