import { useDispatch, useSelector } from "react-redux";
import { Routes, postToNodeServer } from "../../../utils";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { addMessage } from "../../../state/slices";
import { useEffect } from "react";

export function ChatBox(props) {
  const [showEmojis, setShowEmojis] = useState(false);
  const dispatch = useDispatch();

  const username = useSelector((state) => state.userData.username);
  const friendUserName = useSelector((state) => state.activeChat.username);

  const socket = props.socket;

  useEffect(() => {
    if (!props.isSmallWindow) document.getElementById("chatbox").focus();
  }, [props]);

  const sendMessage = async () => {
    const chatbox = document.getElementById("chatbox");
    chatbox.focus();
    if (chatbox.value === "") return;

    const message = {
      from: username,
      to: friendUserName,
      message: chatbox.value,
      time: Date.now(),
    };

    const response = await postToNodeServer(Routes.SEND_MESSAGE_ROUTE, message);

    if (response.status === 200) {
      chatbox.value = "";

      dispatch(
        addMessage({
          friend: message.to,
          message: message,
        })
      );

      if (socket) {
        socket.emit("send message", message);
      }
    }
  };

  return (
    <div className="container-fluid py-2 px-1">
      <div className="row gx-1 px-1">
        <div className="col-sm-11 col-md-10 col-lg-11 col-10 d-flex">
          {window.innerWidth >= 767 ? (
            <i
              className="fa-solid fa-face-laugh-beam text-warning fs-3 align-self-center me-md-2 me-1"
              onClick={() => setShowEmojis(!showEmojis)}
              style={{ cursor: "pointer" }}
            />
          ) : (
            <></>
          )}
          <input
            type="text"
            className="form-control-lg w-100 d-inline"
            id="chatbox"
            placeholder="Enter a message"
            autoComplete="off"
            onFocus={(event) => {
              event.target.style.outline = "none";
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") sendMessage();
            }}
          />
        </div>
        <div className="col-sm-1 col-md-2 col-lg-1 col-2">
          <button
            className="btn btn-success btn-sm w-100 h-100 text-center"
            onClick={(event) => {
              event.target.blur();
              sendMessage();
            }}
          >
            Send
          </button>
        </div>
      </div>
      {showEmojis ? (
        <div className="m-1 container-fluid p-0">
          <EmojiPicker
            theme="dark"
            autoFocusSearch={false}
            lazyLoadEmojis={true}
            width="100%"
            height="335px"
            previewConfig={{
              showPreview: false,
            }}
            onEmojiClick={(event) => {
              document.getElementById("chatbox").value += event.emoji;
              document.getElementById("chatbox").focus();
            }}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
