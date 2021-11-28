import React from "react";

const divStyle = {
  display: "flex",
  height: "100%",
  backgroundColor: "#009988",
  backgroundSize: "cover",
};

const imgStyle = {
  maxWidth: "window",
  minHeight: "window",
  margin: "auto",
  zIndex: "1",
};

const img2Style = {
  position: "absolute",
  zIndex: "3",
  height: "14%",
  width: "18%",
  top: "34%",
  left: "50%",
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
      {/* <img
        style={img2Style}
        src={require("../images/givr_reversed.jpeg").default}
        alt="Example1"
      ></img> */}
    </div>
  );
}

export default SuccessPage;
