import React, { useEffect } from "react";
import "../styles/dashboard.css";
import { db } from "../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import TopUsersChart from "../components/dashboard/MostSubscribedUsersChart";
import UsersAgeChart from "../components/dashboard/UsersAgeChart";
import WaveIcon from "../assets/waveIcon.svg";
import UsersTbody from "../components/users/UsersTbody";
import MostUserPostsTbody from "../components/dashboard/MostUserPostsTbody";

export default function Dashboard() {
  const [totalChatRooms, settotalChatRooms] = useState(0);
  const [totalUsers, settotalUsers] = useState(0);
  const [ageVariations, setageVariations] = useState({});
  const [mostSubscribedUsers, setmostSubscribedUsers] = useState([]);
  const [mostUserPosts, setmostUserPosts] = useState([]);
  const [loading, setloading] = useState(false);
  const [totalPosts, settotalPosts] = useState(0);
  const [allposts, setallposts] = useState([]);

  const [postdata, setpostdata] = useState([]);

  const calculateAgeGroup = (userbmi) => {
    const bmi = userbmi;
    if (bmi >= 15 && bmi <= 16) return "15-16";
    if (bmi >= 16 && bmi <= 17) return "16-17";
    if (bmi >= 17 && bmi <= 18) return "17-18";
    if (bmi >= 18 && bmi <= 19) return "18-19";
    else return "20+";
  };

  const getAllUsers = async () => {
    await getAllPosts()
    const bmiDistribution = {
      "15-16": 0,
      "16-17": 0,
      "17-18": 0,
      "18-19": 0,
      "20+": 0,
    };
    const usersCollectionRef = collection(db, "users");
    getDocs(usersCollectionRef).then((querySnapshot) => {
      settotalUsers(querySnapshot.docs.length);
      const usersArray = [];
      let postuserarr = [];

      querySnapshot.forEach((doc) => {
        const user = doc.data();
        usersArray.push(user);
        console.log(user);
        const userbmi = user.bmi;
        const bmiGroup = calculateAgeGroup(userbmi);
        let count = 0;
        allposts.forEach((post) => {
          if (post.user == user.uid) {
            count = count + 1;
          }
        });

        console.log("posts for user are , ", user.uid, count);
        let postusercountobj = {
          user:user.name,
          postcount:count
        }
        postuserarr.push(postusercountobj);
        // let username = user.name
        // setpostdata([...postdata, [ username, count ]]);

        bmiDistribution[bmiGroup] = (bmiDistribution[bmiGroup] || 0) + 1;
      });
      setpostdata(postuserarr);
      setageVariations({ ...bmiDistribution });

      // usersArray.sort((a, b) => b.subscribers.length - a.subscribers.length);
      // setmostSubscribedUsers(usersArray.slice(0, 7));

      // usersArray.sort((a, b) => b.posts.length - a.posts.length);
      // setmostUserPosts(usersArray.slice(0, 5));
    });
  };

  const getAllPosts = async () => {
    const postsCollectionRef = collection(db, "posts");
    const data = await getDocs(postsCollectionRef);
    let allPost = [];
    data.forEach((doc) => {
      allPost.push(doc.data());
    });
    console.log(allPost);
    setallposts(allPost);
  };
  const getTotallPosts = async () => {
    let { count } = (
      await getCountFromServer(query(collection(db, "posts")))
    ).data();
    settotalPosts(count);
  };

  const getTotallChatRooms = async () => {
    let { count } = (
      await getCountFromServer(query(collection(db, "trainers")))
    ).data();
    settotalChatRooms(count);
  };

  const getData = () => {
    setloading(true);
    Promise.all([getAllUsers(), getTotallPosts(), getTotallChatRooms()])
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener for screen size changes
    window.addEventListener("resize", handleResize);

    // Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // getAllPosts();
    getData();
  }, []);

  return (
    <div className="dashboard">
      <h2 className="underline main-heading">Dashboard page2</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="dashboard-top">
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Users</h4>
                <h2>{totalUsers} users</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Subscribed Users</h4>
                <h2>{totalPosts} Subscribers</h2>
              </div>
              <img src={WaveIcon} />
            </div>
            <div className="dashboard-card">
              <div>
                <h4 className="card-top-heading">Total Trainers</h4>
                <h2>{totalChatRooms} Trainers</h2>
              </div>
              <img src={WaveIcon} />
            </div>
          </div>
          <div>
            <div className="dashboard-chart-wrapper">
              <div className="top-users-wrapper">
                <h2 className="main-heading center">Most Posts By Users</h2>
                <div className="top-users-chart-wrapper">
                  <TopUsersChart
                    screenWidth={screenWidth}
                    usersData={postdata}
                    // subsCount={mostSubscribedUsers.map(
                    //   (user) => user.subscribers.length + 1
                    // )}
                    // userLabels={mostSubscribedUsers.map((user) => user.username)}
                  />
                </div>
              </div>

              <div className="users-age-wrapper">
                <h2 className="main-heading center">
                  Users Classification on BMI
                </h2>
                <div className="users-age-chart-wrapper">
                  <UsersAgeChart
                    screenWidth={screenWidth}
                    usersData={ageVariations}
                    totalUsers={totalUsers}
                    // ageData={Object.keys(ageVariations).map(
                    //   (key) => ageVariations[key]
                    // )}
                    // ageLabels={Object.keys(ageVariations).map((key) => key)}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <div className="dashboard-table-wrapper">
            <h2 className="main-heading">Most Posts By Users</h2>
            <div className="table w-full">
              <table style={{ height: "auto" }}>
                <tr
                  style={{
                    backgroundColor: "transparent",
                    borderBottom: "0.5px solid rgba(124, 124, 124, 0.27)",
                  }}
                >
                  <th></th>
                  <th>UserName</th>
                  <th>Email</th>
                  <th>No. of Posts</th>
                  <th>No. of Subscribers</th>
                  <th>Actions</th>
                </tr>
                {mostUserPosts.map((val, ind) => (
                  <MostUserPostsTbody
                    key={ind}
                    username={val.username}
                    profilePic={val.image}
                    noOfPosts={val.posts.length}
                    noOfSubscribers={val.subscribers.length}
                    email={val.email}
                    id={val.uid}
                  />
                ))}
              </table>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
