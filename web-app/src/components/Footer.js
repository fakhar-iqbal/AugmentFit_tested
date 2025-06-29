import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "../styles/footer.css";
import Button from "@material-ui/core/Button";
import { useState } from "react";
const Footer = ({ postsPerPage, totalPosts, paginate, currentPage }, props) => {
  const [counter, setCounter] = useState(currentPage);

  const forwardButton = () => {
    paginate((prevActiveStep) => prevActiveStep + 1);
    setCounter(counter + 1);
  };

  const previousButton = () => {
    paginate((prevActiveStep) => prevActiveStep - 1);
    setCounter(counter - 1);
  };
  const page = Math.ceil(totalPosts / postsPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  console.log("pages", pageNumbers);
  return (
    <div className="footer">
      <div style={props.contentStyle}>
        Page
        <Button disabled={counter === 1}>
          <IoIosArrowBack className="icon active" onClick={previousButton} />
        </Button>
        {counter} of {page}
        <Button disabled={counter === page}>
          <IoIosArrowForward className="icon active" onClick={forwardButton} />{" "}
        </Button>
      </div>
    </div>
  );
};

export default Footer;
