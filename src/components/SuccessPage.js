import React from "react";

function SuccessPage({ value }) {
  return (
    <div className="success-image-wrapper">
      <img
        src={require("../images/image0.png").default}
        alt="Example1"
        className="success-image"
      ></img>
    </div>
  );
}

export default SuccessPage;
