import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/posts.css";
import LoadingSpinner from "../components/LoadingSpinner";
import PostsTable from "../components/posts/PostsTable";
import Pagination from "../components/posts/Pagination";

export default function ContentVerification() {
  const postsPerPage = 4;

  const [posts, setposts] = useState([]);
  const [loading, setloading] = useState(false);

  async function getPosts() {
    setloading(true);
    const getData = await getDocs(
      query(
        collection(db, "posts"),
        limit(postsPerPage),
        orderBy("createdAt", "desc")
      )
    );

    setposts(getData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setloading(false);
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <PostsTable posts={posts} />
      <Pagination
        setposts={setposts}
        setloading={setloading}
        postsPerPage={postsPerPage}
        posts={posts}
      />
      {loading ? <LoadingSpinner /> : ContentVerification}
    </div>
  );
}
