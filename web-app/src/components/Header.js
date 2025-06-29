import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import ProfilePicture from "./ProfilePicture";
import Headline from "./Headline";
import "../styles/header.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/userContext";
const Header = () => {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const { getuser } = useContext(AuthContext);
  const reff = query(
    collection(db, "webnotifications"),
    where("read", "==", false)
  );
  const getNotification = async () => {
    const getData = await getDocs(reff);
    setData(getData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const totalPosts = Data.length;
  useEffect(() => {
    getNotification();
  }, []);
  return (
    <div className="header">
      <Headline
        text="Admin!"
        line={new Date().toDateString().slice(4)}
        style={{ marginTop: "20px" }}
        lineStyle={{ color: "white", textAlign: "left" }}
      />
      <div className="header-options">
        <div className="flex flex-col not">
          {/* {totalPosts === 0 ? " " : <p className="dot">{totalPosts}</p>}
          <IoIosNotifications
            style={{ cursor: "pointer" }}
            className="icon"
            onClick={() => {
              // toggleColor();
              navigate("/notifications", { replace: true });
            }}
          /> */}
        </div>
        <ProfilePicture picture={getuser()?.picture} />
      </div>
    </div>
  );
};

export default Header;
