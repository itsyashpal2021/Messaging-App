import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../../state/slices";
import ProfilePic from "../ProfilePic";

export function FriendDetails(props) {
  const friend = useSelector((state) => state.activeChat);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("click", (event) => {
      if (
        !document.getElementById("chatOptions").contains(event.target) &&
        !document.getElementById("chatOptionsTriger").isEqualNode(event.target)
      ) {
        setShowChatOptions(false);
      }
    });
    if (friend.username === undefined) {
      document.removeEventListener("click");
    }
  }, [friend]);

  return (
    <div
      className="container-fluid p-sm-2 p-3 text-white d-flex align-items-center position-relative"
      style={{ backgroundColor: "#181e22" }}
    >
      <i
        className="fa-solid fa-arrow-left fs-3 me-3"
        style={{ display: window.innerWidth <= 767 ? "inline" : "none" }}
        onClick={() => dispatch(setActiveChat({}))}
      />
      <ProfilePic
        size="60px"
        className="ms-1 me-3 fs-4"
        src={friend.profilePic}
      />
      <div>
        <p className="fs-2 m-0 lh-1">
          {friend.firstName} {friend.lastName}
        </p>
        <span className="fw-lighter">{friend.username}</span>
      </div>
      <i
        className="fa-solid fa-ellipsis-vertical fs-2 ms-auto"
        id="chatOptionsTriger"
        style={{ cursor: "pointer" }}
        onClick={() => {
          setShowChatOptions(!showChatOptions);
        }}
      />
      <div
        id="chatOptions"
        className="flex-column fs-5"
        style={{
          display: showChatOptions ? "flex" : "none",
          position: "absolute",
          top: "100%",
          right: 0,
          userSelect: "none",
          zIndex: 2,
          backgroundColor: "rgb(24, 30, 34,0.6)",
        }}
      >
        <span
          className="py-1 px-2"
          onMouseEnter={(event) => {
            event.target.style.backgroundColor = "rgb(24, 30, 34,0.8)";
          }}
          onMouseLeave={(event) => {
            event.target.style.backgroundColor = "transparent";
          }}
        >
          Unfriend
        </span>
        <span
          className="py-1 px-2"
          onMouseEnter={(event) => {
            event.target.style.backgroundColor = "rgb(24, 30, 34,0.8)";
          }}
          onMouseLeave={(event) => {
            event.target.style.backgroundColor = "transparent";
          }}
        >
          Clear Chat
        </span>
      </div>
    </div>
  );
}
