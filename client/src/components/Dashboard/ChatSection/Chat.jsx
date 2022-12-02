import { useSelector } from "react-redux";
import { FriendDetails } from "./FriendDetails";
import { MessageBox } from "./MessageBox";

export function Chat(props) {
  const activeChat = useSelector((state) => state.activeChat);

  return (
    <div
      className="col-12 col-md-7 col-xxl-8 p-0 h-100"
      style={{
        display:
          window.innerWidth <= 767 && activeChat.username === undefined
            ? "none"
            : "block",
        position: window.innerWidth <= 767 ? "fixed" : "static",
        top: "0",
        bottom: "0",

        backgroundColor: "rgb(33 48 58)",
      }}
    >
      {activeChat.username === undefined ? (
        <></>
      ) : (
        <div className="d-flex h-100 flex-column container-fluid p-0">
          <FriendDetails />
          <MessageBox {...props} />
        </div>
      )}
    </div>
  );
}
