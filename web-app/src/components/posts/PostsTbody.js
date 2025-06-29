import { collection, deleteDoc, doc, getDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { db } from "../../firebase";
import { useEffect } from "react";
import Modal from "../Modal";
import ReactPlayer from "react-player";
import Moment from "react-moment";
import {
  IoCloseCircleSharp,
  IoHeart,
  IoPlay,
  IoPlayCircle,
  IoPlayCircleOutline,
  IoPlayOutline,
} from "react-icons/io5";
import CommentIcon from "../../assets/comment.svg";

export default function PostsTbody({ post, inappropriateWords }) {
  const [profilePic, setprofilePic] = useState(null);
  const [username, setusername] = useState(null);
  const [isinAppropriate, setisinAppropriate] = useState(false);
  const [showDetailsModal, setshowDetailsModal] = useState(false);
  const [videoPlaying, setvideoPlaying] = useState(false);
  const [showDeleteModal, setshowDeleteModal] = useState(false);

  const getUser = async () => {
    const user = await getDoc(doc(db, "users", post.postedBy));
    const data = user.data();
    setprofilePic(data.image);
    setusername(data.username);
  };

  function checkInappropriate() {
    const lowerCaseDescription = post.description.toLowerCase();
    const words = lowerCaseDescription.split(/\s+/);
    const udpatedWords = words.map((word) => {
      if (inappropriateWords.includes(word)) {
        setisinAppropriate(true);
        return `<span class="highlight">${word}</span>`;
      }
      return word;
    });
    post.description = udpatedWords.join(" ");
    // setisinAppropriate(
    //   inappropriateWords.some((word) =>
    //     lowerCaseDescription.includes(word.toLowerCase())
    //   )
    // );
  }

  const deletePost = async () => {
    const deletedocument = doc(db, "posts", post.postid);
    await deleteDoc(deletedocument);
    window.location.reload();
  };

  const handleDeletePost = () => {
    deletePost();
  };

  useEffect(() => {
    checkInappropriate();
    getUser();
  }, []);

  return (
    <>
      <tr>
        <td className="posts-table-img-wrapper">
          <img src={profilePic} className="posts-table-img" />
        </td>
        <td>
          <div className="name">{username}</div>
        </td>
        <td>{post.category}</td>
        <td>
          <div
            className="posts-table-desc"
            style={{ lineHeight: "25px" }}
            dangerouslySetInnerHTML={{
              __html:
                post.description.length > 75
                  ? post.description.substring(0, 75) + "..."
                  : post.description,
            }}
          ></div>
        </td>
        <td>{new Date(post.createdAt).toDateString().slice(4)}</td>
        <td className={`${isinAppropriate ? "text-inapp" : "text-app"}`}>
          {isinAppropriate ? "Yes" : "No"}
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          <button
            style={{ cursor: "pointer" }}
            className="accept"
            onClick={() => setshowDetailsModal(true)}
          >
            View
          </button>
          <button
            className="decline"
            style={{ cursor: "pointer" }}
            onClick={() => setshowDeleteModal(true)}
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal
        title="Post Details"
        show={showDetailsModal}
        hideModal={() => setshowDetailsModal(false)}
        // contentStyle={{ padding: "0px 15px" }}
        headerStyle={{ display: "none" }}
      >
        <div className="post-details">
          <div className="post-header">
            <div className="post-header-left">
              <img src={profilePic} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <small>{username}</small>
                <small>
                  <Moment format="DD MMM">{post.createdAt}</Moment> at{" "}
                  <Moment format="HH:MM a">{post.createdAt}</Moment>
                </small>
              </div>
            </div>
            <IoCloseCircleSharp
              style={{ cursor: "pointer", width: "26px", height: "26px" }}
              onClick={() => setshowDetailsModal(false)}
              className="icon"
            />
          </div>
          <div
            onClick={() => setvideoPlaying(!videoPlaying)}
            className="content-video-wrapper"
          >
            {!videoPlaying && (
              <div className="post-play-icon">
                <IoPlayCircleOutline size={"40px"} />
              </div>
            )}
            <ReactPlayer
              playing={videoPlaying}
              url={post.videoUrl}
              onEnded={() => setvideoPlaying(false)}
            />
          </div>
          <div style={{ marginTop: "30px" }}>
            <div className="likes-wrapper">
              <IoHeart color="red" size={"20px"} />
              <p>{post.likes.length} likes</p>
            </div>
            <div
              style={{
                marginTop: "10px",
                marginBottom: "15px",
                lineHeight: "25px",
              }}
            >
              <small style={{ opacity: 0.5 }}>Description: </small>
              <p
                style={{ width: "95%", marginTop: "8px" }}
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </div>
            {/* <p style={{  }}>{post.category}</p> */}
            <div className="comments-wrapper">
              <img src={CommentIcon} />
              <p style={{}}>{post.comments.length} comments</p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Confirm Delete Post"
        show={showDeleteModal}
        hideModal={() => setshowDeleteModal(false)}
      >
        <div className="modal-content-center" style={{ marginBottom: "40px" }}>
          <h3>Are you sure you want to delete this post?</h3>
          <button
            className="user-modal-btn"
            style={{ width: "50%", marginTop: "20px", cursor: "pointer" }}
            onClick={handleDeletePost}
          >
            Delete Post
          </button>
        </div>
      </Modal>
    </>
  );
}
