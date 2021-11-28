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
  zIndex: "1",
};

const img2Style = {
  position: "absolute",
  zIndex: "3",
  height: "110px",
  width: "85px",
  top: "36%",
  left: "40%",
  borderRadius: "50%",
};

function SuccessPage({ value }) {
  return (
    <div style={divStyle}>
      <img
        style={imgStyle}
        src={require("../images/image0.png").default}
        alt="Example1"
      ></img>
      <img
        style={img2Style}
        src={require("../images/givr_reversed.jpeg").default}
        alt="Example1"
      ></img>
    </div>
  );
}

export default SuccessPage;
