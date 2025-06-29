import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import "../styles/users.css";
import "../styles/table.css";
import InputField from "../components/InputField";
import Modal from "../components/Modal";
import "../styles/categories.css";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { collection, addDoc, getDocs } from "firebase/firestore";
import UsersTbody from "../components/users/UsersTbody";
import LoadingSpinner from "../components/LoadingSpinner";
import TrainersTbody from "../components/trainers/TrainersTbody";

export default function Trainers() {
  const [isLoading, setIsLoading] = useState(false);
  const [addname, setaddname] = useState("");
  const [addemail, setaddemail] = useState("");
  const [addphone, setaddphone] = useState("");
  const [modal, setmodal] = useState(false);
  const [message, setmessage] = useState("");
  const [apiCalled, setapiCalled] = useState(false);

  const addName = (e) => setaddname(e.target.value);
  const addEmail = (e) => setaddemail(e.target.value);
  const addPhone = (e) => setaddphone(e.target.value);

  const [userData, setuserData] = useState([]);
  const addrefUser = collection(db, "trainers");

  const getUsers = async () => {
    setIsLoading(true);
    const getData = await getDocs(addrefUser);
    setuserData(getData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setIsLoading(false);
  };

  const keys = ["name", "username", "email", "phoneNo"];
  const [search, setsearch] = useState("");
  const searches = (datas) => {
    return datas.filter((item) =>
      keys.some((key) => item[key]?.toLowerCase().includes(search))
    );
  };

  const addUser = async () => {
    // const curDate = new Date();
    // curDate.getDate() +
    // "-" +
    // (curDate.getMonth() + 1) +
    // "-" +
    // curDate.getFullYear(),

    setapiCalled(true);
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        addemail,
        "abcd1234"
      );
      const user = res.user;
      await addDoc(addrefUser, {
        uid: user.uid,
        email: addemail,
        name: addname,
        phone: addphone,
        userType:"Trainer",
        avatar: "https://firebasestorage.googleapis.com/v0/b/augmentfit.appspot.com/o/sample%20Profile.png?alt=media&token=18105535-d61c-45e5-a8c8-9107d2409dc8",
        gender:"",
        age:0,
        weight:0,
        height:0,
        bmi:0,
      });
      getUsers();
      setaddname("");
      setaddemail("");
      setaddphone("");
      setmessage("Trainer added successfully");
    } catch (err) {
      setmessage(err.message);
    }
    setmodal(false);
    setapiCalled(false);
    setIsLoading(false);
  };

  const showModal = () => {
    setmodal(true);
  };
  const hideModal = () => setmodal(false);

  useEffect(() => {
    setTimeout(() => {
      if (message) setmessage("");
    }, 2000);

    getUsers();
  }, []);

  return (
    <>
      <div className="users">
        {message && <h4 className="message">{message}</h4>}
        <div className="flexing">
          <h2>Trainers</h2>
          <button
            style={{ cursor: "pointer" }}
            className="add-user-btn"
            onClick={showModal}
          >
            Add
          </button>
        </div>
        <div className="search-bar">
          <IoSearchOutline className="icon" />
          <input
            value={search}
            onChange={(e) => setsearch(e.target.value)}
            placeholder="Search trainer by name or email..."
          />
        </div>

        <div className="table w-full">
          <table style={{ height: "auto" }}>
            <tr
              style={{
                backgroundColor: "transparent",
                borderBottom: "0.5px solid rgba(124, 124, 124, 0.27)",
              }}
            >
              <th></th>
              <th>Trainer Name</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Actions</th>
            </tr>
            {searches(userData).map((val, ind) => {
              return (
                <TrainersTbody
                  key={ind}
                  profilePic={val.avatar}
                  id={val.id}
                  name={val.name}
                  username={val.name}
                  email={val.email}
                  phone={val.phone}
                  bio={val.bio}
                  dob={val.dateOfBirth}
                />
              );
            })}
          </table>
        </div>
      </div>
      {/* } */}
      <Modal
        title="Add New Trainer"
        show={modal}
        hideModal={hideModal}
        contentStyle={{ height: "350px" }}
      >
        <div className="modal-content-center">
          <InputField
            fieldStyle={{ height: "45px" }}
            placeholder="Enter Name"
            value={addname}
            changeHandler={addName}
          />
          <InputField
            fieldStyle={{ height: "45px" }}
            placeholder="Enter Email"
            value={addemail}
            changeHandler={addEmail}
          />
          <InputField
            fieldStyle={{ height: "45px" }}
            placeholder="Enter Phone no"
            value={addphone}
            changeHandler={addPhone}
          />
          <button
            className="user-modal-btn"
            style={{ margin: "10px 20px", cursor: "pointer" }}
            onClick={addUser}
            disabled={apiCalled}
          >
            Add Trainer
          </button>
        </div>
      </Modal>

      {isLoading ? <LoadingSpinner /> : Trainers}
    </>
  );
}
