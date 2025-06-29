import handImage from "../assets/hand.png";
import "../styles/headline.css";

const Headline = (props) => {
  return (
    <div className="headline" style={{ ...props.style }}>
      <div className="center-container">
        Welcome {props.text}
        {/* <img
          src={handImage}
          style={{ width: "30.49px", height: "33.28px" }}
          alt=""
        ></img> */}
      </div>
      <p className="paraLine" style={props.lineStyle}>
        {props.line}
      </p>
    </div>
  );
};

export default Headline;
