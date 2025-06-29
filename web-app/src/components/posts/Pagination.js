import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "../../styles/pagination.css";
import {
  collection,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import { useEffect } from "react";

export default function Pagination({
  setposts,
  setloading,
  postsPerPage,
  posts,
}) {
  const [totalPages, settotalPages] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  async function getTotalPosts() {
    const { count } = (
      await getCountFromServer(query(collection(db, "posts")))
    ).data();
    settotalPages(Math.ceil(count / postsPerPage));
  }

  async function getNextPosts() {
    setloading(true);
    setposts([]);
    const getData = await getDocs(
      query(
        collection(db, "posts"),
        limit(postsPerPage),
        orderBy("createdAt", "desc"),
        startAfter(posts[posts.length - 1].createdAt)
      )
    );

    setposts(getData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setcurrentPage((prevPage) => prevPage + 1);
    setloading(false);
  }

  async function getPrevPosts() {
    setloading(true);
    setposts([]);
    const getData = await getDocs(
      query(
        collection(db, "posts"),
        limitToLast(postsPerPage),
        orderBy("createdAt", "desc"),
        endBefore(posts[0].createdAt)
      )
    );

    setposts(getData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setcurrentPage((prevPage) => prevPage - 1);
    setloading(false);
  }

  const forwardButton = () => {
    getNextPosts();
  };

  const previousButton = () => {
    getPrevPosts();
  };

  useEffect(() => {
    getTotalPosts();
  }, []);

  return (
    <div className="footer">
      <div>
        Page
        <button
          disabled={currentPage == 1}
          className="paginate-btn"
          onClick={previousButton}
        >
          <IoIosArrowBack className="icon active" />
        </button>
        {currentPage} of {totalPages}
        <button
          disabled={currentPage == totalPages}
          className="paginate-btn"
          onClick={forwardButton}
        >
          <IoIosArrowForward className="icon active" />{" "}
        </button>
      </div>
    </div>
  );
}
