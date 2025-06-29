import React, { useState, useEffect } from "react";
import { IoLockClosedOutline, IoPencil } from "react-icons/io5";
import profileIcon from "../assets/profilePictureIcon.png";
import "../styles/settings.css";
import { auth, db, storage } from "../firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
} from "firebase/auth";
const Settings = (props) => {
  const [emailupdate, setemailupdate] = useState("");
  const [image, setimage] = useState("");
  const [passwordupdate, setpasswordupdate] = useState("");
  const [userData, setuserData] = useState(null);
  const changeimage = (e) => setimage(e.target.files[0]);

  const addrefUser = collection(db, "admin");
  const updateuser = async () => {
    try {
      const user = auth.currentUser;

      if (emailupdate) {
        try {
          await updateEmail(user, emailupdate);
          window.location.reload();
        } catch (err) {
          alert("Invalid email");
        }
      }
      if (passwordupdate) {
        try {
          await updatePassword(user, passwordupdate);
          window.location.reload();
        } catch (err) {
          alert("Password must be atleast 6 characters");
        }
      }
    } catch (err) {
      alert("Please login again to update your email and password");
    }
    // let userArray = {};
    // if (emailupdate !== "" && passwordupdate !== "") {
    //   userArray = {
    //     email: emailupdate,
    //     password: passwordupdate,
    //   };
    // }
    // if (emailupdate !== "" && passwordupdate === "") {
    //   userArray = {
    //     email: emailupdate,
    //   };
    // }
    // if (emailupdate === "" && passwordupdate !== "") {
    //   userArray = {
    //     password: passwordupdate,
    //   };
    // }
    // const updatedocument = doc(db, "admin", uid);
    // await updateDoc(updatedocument, userArray);
    // window.location.reload();
  };
  const updateAdmin = async () => {
    const imageRef = ref(storage, `${image.name}`);
    await uploadBytes(imageRef, image);
    const downloadimg = await getDownloadURL(imageRef);
    const updatedocument = doc(db, "admin", userData.id);
    await updateDoc(updatedocument, {
      picture: downloadimg,
    });

    const adminData = JSON.parse(localStorage.getItem("user"));
    const updatedAdminData = { ...adminData, picture: downloadimg };
    localStorage.setItem("user", JSON.stringify(updatedAdminData));
    alert("Image Uploaded");
    window.location.reload();
  };

  const getUser = async () => {
    const getData = await getDocs(addrefUser);
    setuserData(getData.docs[0].data());
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="settings">
      <h2 className="settings-title">Settin</h2>
      <div>
        <h3>Security</h3>
        <div className="settings-fields-container">
          <div className="field">
            <input
              value={passwordupdate}
              onChange={(e) => setpasswordupdate(e.target.value)}
              placeholder="Change Passwordzzz"
            />
            <IoLockClosedOutline className="icon" />
          </div>
          <div className="field" style={{ borderBottom: "none" }}>
            <input
              value={emailupdate}
              onChange={(e) => setemailupdate(e.target.value)}
              placeholder="Change Email"
            />
            <img
              src={profileIcon}
              alt=""
              style={{ width: "18px", height: "20px" }}
            ></img>
          </div>
          <button
            style={{ cursor: "pointer" }}
            className="accept"
            onClick={updateuser}
          >
            Approve
          </button>
        </div>
      </div>
      <div>
        <h3>General</h3>
        <div className="settings-fields-container">
          {/* <div className="field">
            <p>Notifications</p>
            <label class="switch">
              <input type="checkbox" />
              <span class="slider round"></span>
            </label>
          </div> */}
          <div className="field">
            {image != "" ? <p>{image.name}</p> : <p>Change Profile picture</p>}

            <label for="file">
              <IoPencil className="icon" />

              <input
                type="file"
                onChange={changeimage}
                id="file"
                style={{ display: "none" }}
              />
            </label>
          </div>
          <button
            className="accept"
            style={{ marginTop: 21, marginBottom: 21, cursor: "pointer" }}
            onClick={updateAdmin}
          >
            upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
