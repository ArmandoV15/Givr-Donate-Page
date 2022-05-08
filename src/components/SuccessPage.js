import React, { useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function SuccessPage({ value }) {
  const [userImage, setUserImage] = useState("");
  const [width, setWidth] = React.useState(window.innerWidth);
  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateWidthAndHeight);
    return () => window.removeEventListener("resize", updateWidthAndHeight);
  });

  const storage = getStorage();
  const storageRef = ref(storage, value);
  getDownloadURL(ref(storage, storageRef))
    .then((url) => {
      setUserImage(url);
    })
    .catch((error) => {
      // Handle any errors
      console.log(error);
    });

  console.log(userImage);
  return (
    <>
      {width < 500 ? (
        <div className="success-image-wrapper">
          <img
            src={require("../images/thank_you.PNG").default}
            alt="Example1"
            className="success-image"
          ></img>
        </div>
      ) : (
        <div className="success-image-wrapper-big">
          <img
            src={require("../images/thank_you.PNG").default}
            alt="Example1"
          ></img>
        </div>
      )}
    </>
  );
}

export default SuccessPage;
