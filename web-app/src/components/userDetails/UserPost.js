import React from "react";
import { useState } from "react";
import { IoHeart, IoPlayCircleOutline } from "react-icons/io5";
import Moment from "react-moment";
import ReactPlayer from "react-player";
import CommentIcon from "../../assets/comment.svg";

export default function UserPost({ user, post }) {
  const [videoPlaying, setvideoPlaying] = useState(false);
  return (
    <div className="post-details">
      <div className="post-header">
        <div className="post-header-left">
          <img src={user.image} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <small>{user.username}</small>
            <small>
              <Moment format="DD MMM">{post.createdAt}</Moment> at{" "}
              <Moment format="HH:MM a">{post.createdAt}</Moment>
            </small>
          </div>
        </div>
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
          <IoHeart color="red" size={"20px"} style={{ fill: "red" }} />
          <p>{post.likes.length} likes</p>
        </div>
        <div style={{ marginTop: "10px", marginBottom: "15px" }}>
          <small style={{ opacity: 0.5 }}>Description: </small>
          <p style={{ width: "95%", marginTop: "8px" }}>{post.description}</p>
        </div>
        {/* <p style={{  }}>{post.category}</p> */}
        <div className="comments-wrapper">
          <img src={CommentIcon} />
          <p style={{}}>{post.comments.length} comments</p>
        </div>
      </div>
    </div>
  );
}
