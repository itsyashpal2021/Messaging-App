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

    document.getElementById("loadingDiv").style.display = "flex";
    document.getElementById("profilePicOptions").style.maxHeight = "0px";

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

  const removeProfilePicture = async () => {
    document.getElementById("loadingDiv").style.display = "flex";
    document.getElementById("profilePicOptions").style.maxHeight = "0px";

    const res = await postToNodeServer(Routes.REMOVE_PROFILE_PIC, {});
    if (res.status === 200) {
      document.getElementById("loadingDiv").style.display = "none";
      dispatch(setProfilePic(undefined));
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
            onClick={() => setShowFullProfilePic(false)}
          />
          <div id="fullProfilePic">
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

            <div id="loadingDiv" style={{ display: "none" }}>
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
          <div className="position-relative">
            <i
              className="fa-solid fa-ellipsis-vertical fs-4 p-2 ms-auto"
              onClick={() => {
                const profilePicOptions =
                  document.getElementById("profilePicOptions");

                profilePicOptions.style.maxHeight === "0px"
                  ? (profilePicOptions.style.maxHeight = "70px")
                  : (profilePicOptions.style.maxHeight = "0px");
              }}
            />
            <div id="profilePicOptions" style={{ maxHeight: 0 }}>
              <span
                className="p-1"
                onClick={() => {
                  if (
                    document.getElementById("loadingDiv").style.display ===
                    "none"
                  )
                    document.getElementById("profilePicInput").click();
                }}
              >
                Upload Photo
              </span>
              {userData.profilePic ? (
                <span className="p-1" onClick={removeProfilePicture}>
                  Remove Photo
                </span>
              ) : (
                <></>
              )}
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
