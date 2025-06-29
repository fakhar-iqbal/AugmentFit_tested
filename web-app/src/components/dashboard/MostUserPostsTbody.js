import React from "react";
import { Link } from "react-router-dom";

export default function MostUserPostsTbody({
  key,
  username,
  profilePic,
  email,
  noOfPosts,
  noOfSubscribers,
  id,
}) {
  return (
    <tr key={key}>
      <td className="posts-table-img-wrapper" style={{ cursor: "pointer" }}>
        <img src={profilePic} className="posts-table-img" />
      </td>
      <td>{username}</td>
      <td>{email}</td>
      <td>{noOfPosts}</td>
      <td>{noOfSubscribers}</td>

      <td>
        <Link to={`/users/${id}`} target="_blank">
          <button
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              width: "fit-content",
              padding: "8px",
            }}
            className="accept"
          >
            View Recent Activity
          </button>
        </Link>
      </td>
    </tr>
  );
}
