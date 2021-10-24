import React from "react";

function SuccessPage() {
  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <div className="img-wrapper">
          <img
            src={require("../images/givr_reversed.jpeg").default}
            alt="Givr"
            width="200"
            height="200"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
