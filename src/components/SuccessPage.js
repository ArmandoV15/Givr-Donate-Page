import React, { useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function SuccessPage({ value }) {
  const [userImage, setUserImage] = useState("");
  const lastSegment = value.split("/").pop();

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
    <div className="success-image-wrapper">
      <img
        src={require("../images/image0.png").default}
        alt="Example1"
        className="success-image"
      ></img>
      {/* <img src={userImage} alt="pic" className="profile-pic"></img> */}
    </div>
  );
}

export default SuccessPage;
