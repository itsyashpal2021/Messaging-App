import { useSelector } from "react-redux";
import { ChatAnimation } from "./ChatAnimation";
import { FriendDetails } from "./FriendDetails";
import { MessageBox } from "./MessageBox";
import { ChatBox } from "./ChatBox";
import { useEffect, useState } from "react";

export function Chat(props) {
  const activeChat = useSelector((state) => state.activeChat);
  const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth <= 767);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsSmallWindow(window.innerWidth <= 767);
    });
  }, []);

  return (
    <div
      className="col-12 col-md-7 col-xxl-8 p-0 h-100"
      style={{
        display:
          isSmallWindow && activeChat.username === undefined ? "none" : "block",
        position: isSmallWindow ? "fixed" : "static",
        top: "0",
        bottom: "0",

        backgroundColor: "rgb(33 48 58)",
      }}
    >
      {activeChat.username === undefined ? (
        <ChatAnimation />
      ) : (
        <div className="d-flex h-100 flex-column container-fluid p-0">
          <FriendDetails />
          <MessageBox {...props} />
          <ChatBox {...props} isSmallWindow={isSmallWindow} />
        </div>
      )}
    </div>
  );
}
