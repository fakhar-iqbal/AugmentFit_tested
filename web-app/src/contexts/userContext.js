import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const AuthContext = React.createContext();

function AuthProvider({ children }) {
  function checkAuth() {
    return new Promise((resolve, reject) => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (!localStorage.getItem("user")) {
            // signOut(auth);
            resolve(false);
          } else {
            resolve(true);
          }
          // localStorage.getItem("user");
        } else {
          localStorage.removeItem("user");
          resolve(false);
        }
      });
    });
    // auth.currentUser ? true : false;
    // const user = localStorage.getItem("user");
    // if (user) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  function logout() {
    signOut(auth)
      .then((res) => {
        localStorage.removeItem("user");
      })
      .catch((err) => {});
  }
  async function login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const adminQuery = query(
        collection(db, "admin"),
        where("id", "==", user.user.uid)
      );
      const admin = await getDocs(adminQuery);
      const adminData = admin.docs[0].data();
      const data = {
        picture: adminData.picture,
      };
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      throw new Error("Invalid Credentials");
    }
    // try {
    //   const adminQuery = query(
    //     collection(db, "admin"),
    //     where("email", "==", email)
    //   );
    //   const getData = await getDocs(adminQuery);
    //   const adminData = getData.docs[0].data();
    //   if (password == adminData.password) {
    //     const data = {
    //       name: adminData.name,
    //       email: adminData.email,
    //       number: adminData.phoneNumber,
    //       picture: adminData.picture,
    //     };
    //     localStorage.setItem("user", JSON.stringify(data));
    //   } else {
    //     throw new Error("Invalid Credentials");
    //   }
    // } catch (err) {
    //   throw new Error("Invalid Credentials");
    // }
  }
  function getuser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  const value = {
    checkAuth,
    logout,
    login,
    getuser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
