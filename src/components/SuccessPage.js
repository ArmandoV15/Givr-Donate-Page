import React from "react";

const divStyle = {
  display: "grid",
  height: "100%",
  backgroundColor: "#009988",
};

const imgStyle = {
  maxWidth: "100%",
  minHeight: "100vh",
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
