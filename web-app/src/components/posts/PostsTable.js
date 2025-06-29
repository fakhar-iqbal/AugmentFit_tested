import React from "react";
import PostsTbody from "./PostsTbody";
import textFile from "../../assets/filter-words.txt";
import { useState } from "react";
import { useEffect } from "react";

export default function PostsTable({ posts }) {
  const [inappropriateWords, setInappropriateWords] = useState([]);
  async function fetchInappropriateWords() {
    try {
      const response = await fetch(textFile); // Adjust the path
      const text = await response.text();
      const wordsArray = text.split(",").map((word) => word.trim());
      setInappropriateWords(wordsArray);
    } catch (error) {}
  }

  useEffect(() => {
    fetchInappropriateWords();
  }, []);

  return (
    <div className="posts">
      <div className="flexing">
        <h2>Content Verification</h2>
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
            <th>Username</th>
            <th>Category</th>
            <th>Description</th>
            <th>Created On</th>
            <th>Inappropriate Content</th>
            <th>Actions</th>
          </tr>
          <>
            {posts.map((post) => (
              <PostsTbody post={post} inappropriateWords={inappropriateWords} />
            ))}
          </>
        </table>
      </div>
    </div>
  );
}
