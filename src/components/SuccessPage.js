import React from "react";
import background from "../images/image0.png";

const imgMyimageexample = require("../images/image0.png");
const divStyle = {
  display: "grid",
  height: "100%",
  backgroundColor: "#009988",
};

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "100%",
  margin: "auto",
};

function SuccessPage() {
  return (
    <div style={divStyle}>
      <img
        style={imgStyle}
        src={require("../images/image0.png").default}
        alt="Example1"
      ></img>
    </div>
  );
}

export default SuccessPage;
