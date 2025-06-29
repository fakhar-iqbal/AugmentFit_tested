import dummy_image from "../assets/dummy_image.jpeg";
import "../styles/profile-picture.css";
import ProfileIcon from "../assets/profileIcon.svg";

const ProfilePicture = (props) => {
  return (
    <div className="profile-picture" style={props.style}>
      <img
        style={{
          height: "70px",
          width: "100px",
        }}
        src={
          "https://firebasestorage.googleapis.com/v0/b/augmentfit.appspot.com/o/sample%20Profile.png?alt=media&token=18105535-d61c-45e5-a8c8-9107d2409dc8"
        }
        alt="img"
      ></img>
    </div>
  );
};

export default ProfilePicture;
