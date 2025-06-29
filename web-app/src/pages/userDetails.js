import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import "../styles/userDetails.css";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import UserPost from "../components/userDetails/UserPost";

export default function UserDetails() {
  const [user, setuser] = useState(null);
  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);
  const { userid } = useParams();

  const getUser = async () => {
    setloading(true);
    const user = await getDoc(doc(db, "users", userid));
    const data = user.data();
    setuser(data);
  };
  const getUserPosts = async () => {
    const postsQuery = query(
      collection(db, "posts"),
      where("postedBy", "==", userid)
    );
    const data = await getDocs(postsQuery);
    setposts(data.docs.map((doc) => ({ ...doc.data() })));
    setloading(false);
  };

  useEffect(() => {
    getUser().then((res) => {
      getUserPosts();
    });
  }, []);

  return (
    <div className="user-details">
      {loading ? (
        <div className="user-details-loading-wrapper">
          <LoadingSpinner />
        </div>
      ) : posts.length > 0 ? (
        <div className="user-details-container">
          <h1 style={{ marginBottom: "30px", textAlign: "center" }}>
            Recent Activity for {user.username}
          </h1>
          {posts.map((post) => (
            <>
              <UserPost post={post} user={user} />
              <hr style={{ width: "100%", margin: "20px 0px", opacity: 0.5 }} />
            </>
          ))}
        </div>
      ) : (
        <div className="no-user-details-wrapper">
          <p>No Recent Activity</p>
        </div>
      )}
    </div>
  );
}
