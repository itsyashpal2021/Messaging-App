import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setActiveChat,
  setFriendData,
  setProfilePic,
} from "../../state/slices";
import { setUser } from "../../state/slices";
import { postToNodeServer, Routes } from "../../utils";
import ProfilePic from "./ProfilePic";
import "../../Css/UserProfile.css";

export function UserProfile(props) {
  let navigate = useNavigate();

  const userData = useSelector((state) => state.userData);
  const dispatch = useDispatch();

  const [showFullProfilePic, setShowFullProfilePic] = useState(false);

  const onLogout = async () => {
    const response = await postToNodeServer(Routes.LOGOUT_ROUTE, {});
    if (response.status === 200) {
      dispatch(setUser({}));
      dispatch(
        setFriendData({
          friendList: [],
          friendRequestsRecieved: [],
          friendRequestsSent: [],
        })
      );
      dispatch(setActiveChat({}));
      navigate(Routes.LOGIN_ROUTE);
    }
  };

  const updateProfilePic = async (imgFile) => {
    const formData = new FormData();
    formData.append("profilePic", imgFile);

    document.getElementById("editProfilePicDiv").style.visibility = "hidden";
    document.getElementById("loadingDiv").style.display = "flex";

    const res = await fetch(Routes.UPLOAD_PROFILE_PIC, {
      method: "POST",
      body: formData,
    });

    if (res.status === 200) {
      const responseJson = await res.json();
      const src = responseJson.src;
      document.getElementById("loadingDiv").style.display = "none";
      dispatch(setProfilePic(src));
    } else {
      console.error("Can not update profile picture:", res);
    }
  };

  return (
    <div
      className="container-fluid d-flex p-2"
      style={{ backgroundColor: "#1B2430", color: "white" }}
    >
      {showFullProfilePic ? (
        <div className=" container-fluid d-flex p-2">
          <i
            className="fa-sharp fa-solid fa-arrow-left fs-4 p-2"
            style={{ height: "fit-content" }}
            onClick={() => setShowFullProfilePic(false)}
          />
          <div
            id="fullProfilePic"
            onMouseOver={() => {
              if (
                document.getElementById("loadingDiv").style.display !== "flex"
              )
                document.getElementById("editProfilePicDiv").style.visibility =
                  "visible";
            }}
            onMouseOut={() => {
              if (
                document.getElementById("loadingDiv").style.display !== "flex"
              )
                document.getElementById("editProfilePicDiv").style.visibility =
                  "hidden";
            }}
          >
            <ProfilePic className="w-100 h-100" src={userData.profilePic} />
            <input
              type="file"
              id="profilePicInput"
              className="visually-hidden"
              accept="image/*"
              onChange={async (event) => {
                if (event.target.files.length === 0) return;
                const imgFile = event.target.files[0];
                updateProfilePic(imgFile);
              }}
            />
            <div
              id="editProfilePicDiv"
              className="h-100 w-100 d-flex justify-content-center align-items-center"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                border: "1px solid grey",
                borderRadius: "50%",
                backgroundColor: "rgb(0,0,0,0.4)",
                zIndex: 2,
                visibility: "hidden",
              }}
              onClick={() => {
                document.getElementById("profilePicInput").click();
              }}
            >
              <i className="fa-solid fa-pen text-warning fs-1" />
            </div>

            <div id="loadingDiv">
              <span className="fs-6 text-center">Updating...</span>
              <div className="d-flex">
                <div className="loadingCircles" />
                <div className="loadingCircles" />
                <div className="loadingCircles" />
                <div className="loadingCircles" />
                <div className="loadingCircles" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            <div className="me-2 p-lg-2 p-1 position-relative">
              <ProfilePic
                size="80px"
                className="fs-1"
                id="profilePic"
                src={userData.profilePic}
                onClick={() => {
                  setShowFullProfilePic(true);
                }}
              />
            </div>
            <div>
              <p className="m-0 fs-1 text-center">{userData.username}</p>
              <p className="m-0 h5 text-center">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="m-0 text-primary text-center">{userData.email}</p>
            </div>
          </div>
          <i
            className="fa-solid fa-right-from-bracket fs-4 text-danger align-self-center ms-auto p-2"
            onClick={onLogout}
            style={{ cursor: "pointer" }}
          />
        </>
      )}
    </div>
  );
}
