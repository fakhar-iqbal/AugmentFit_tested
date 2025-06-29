import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { updateDoc, deleteDoc, doc } from "firebase/firestore";
import InputField from "../InputField";
import Modal from "../Modal";
import "../../styles/categories.css";
import { Link } from "react-router-dom";

export default function TrainersTbody(props) {
  const [modal, setmodal] = useState(false);
  const [nameupdate, setnameupdate] = useState(props.name);
  const [emailupdate, setemailupdate] = useState(props.email);
  const [phoneupdate, setphoneupdate] = useState(props.phone);
  const [usernameupdate, setusernameupdate] = useState(props.username);
  const [DOBupdate, setDOBupdate] = useState(props.dob);
  const [bioupdate, setbioupdate] = useState(props.bio);
  const [isLoading, setIsLoading] = useState(false);
  const updateName = (e) => setnameupdate(e.target.value);
  const updateEmail = (e) => setemailupdate(e.target.value);
  const updatePhone = (e) => setphoneupdate(e.target.value);
  const updateUsername = (e) => setusernameupdate(e.target.value);
  const updateDOB = (e) => setDOBupdate(e.target.value);
  const updateBio = (e) => setbioupdate(e.target.value);
  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const showModal = () => {
    setmodal(true);
  };
  const hideModal = () => setmodal(false);

  const updateuser = async (uid) => {
    setIsLoading(true);
    let userArray = {
      name: nameupdate,
      email: emailupdate,
      username: usernameupdate,
      bio: bioupdate,
      dateOfBirth: DOBupdate,
      phoneNo: phoneupdate,
    };
    const updatedocument = doc(db, "trainers", uid);
    await updateDoc(updatedocument, userArray);
    hideModal();

    window.location.reload();
    setIsLoading(false);
  };

  const deleteuser = async () => {
    setIsLoading(true);
    const deletedocument = doc(db, "trainers", props.id);
    await deleteDoc(deletedocument);
    window.location.reload(true);
    setIsLoading(false);
  };

  return (
    <>
      <tr>
        <Link to={`/users/${props.id}`} target="_blank">
          <td className="posts-table-img-wrapper" style={{ cursor: "pointer" }}>
            <img src={props.profilePic} className="posts-table-img" />
          </td>
        </Link>
        <td>{props.username}</td>
        <td>{props.email}</td>
        <td>{props.phone}</td>
        <td style={{ whiteSpace: "nowrap" }}>
          <button
            onClick={showModal}
            style={{ cursor: "pointer" }}
            className="accept"
          >
            Edit
          </button>
          <button
            onClick={() => setshowDeleteModal(true)}
            className="decline"
            style={{ cursor: "pointer" }}
          >
            Delete
          </button>
        </td>
      </tr>

      <Modal title="Update Trainer" show={modal} hideModal={hideModal}>
        <div className="modal-content-center">
          <div className="user-modal-inputs-wrapper">
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Name:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Name"
                value={nameupdate}
                changeHandler={updateName}
              />
            </div>
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Email:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Email"
                value={emailupdate}
                changeHandler={updateEmail}
              />
            </div>
          </div>
          <div className="user-modal-inputs-wrapper">
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Phone No:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Phone no"
                value={phoneupdate}
                changeHandler={updatePhone}
              />
            </div>
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Username:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Username"
                value={usernameupdate}
                changeHandler={updateUsername}
              />
            </div>
          </div>
          <div className="user-modal-inputs-wrapper">
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">Date of Birth:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Date of Birth  (DD/MM/YYYY)"
                value={DOBupdate}
                changeHandler={updateDOB}
              />
            </div>
            <div className="user-modal-input-label-wrapper">
              <span className="user-modal-label">BMI:</span>
              <InputField
                style={{ width: "100%" }}
                fieldStyle={{ height: "45px" }}
                placeholder="Enter Bio"
                value={bioupdate}
                changeHandler={updateBio}
              />
            </div>
          </div>
          <button
            className="user-modal-btn"
            style={{ margin: "10px 20px", cursor: "pointer" }}
            value={props.id}
            onClick={(e) => updateuser(e.target.value)}
          >
            Update Trainer
          </button>
        </div>
      </Modal>

      <Modal
        title="Confirm Delete Trainer"
        show={showDeleteModal}
        hideModal={() => setshowDeleteModal(false)}
      >
        <div className="modal-content-center" style={{ marginBottom: "40px" }}>
          <h3>Are you sure you want to delete this trainer?</h3>
          <button
            className="user-modal-btn"
            style={{ width: "50%", marginTop: "20px", cursor: "pointer" }}
            onClick={deleteuser}
          >
            Delete Trainer
          </button>
        </div>
      </Modal>
    </>
  );
}
