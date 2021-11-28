import React from "react";

const divStyle = {
  display: "grid",
  height: "100%",
  backgroundColor: "#009988",
  overflow: "auto",
};

const imgStyle = {
  minWidth: "100%",
  minHeight: "100%",
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
