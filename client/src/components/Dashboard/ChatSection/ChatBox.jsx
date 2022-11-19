import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Routes, postToNodeServer, updateUserData } from "../../../utils";

export function ChatBox(props) {
  const username = useSelector((state) => state.user.username);
  const friendUserName = useSelector((state) => state.activeChat.username);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sendMessage = () => {
    const chatbox = document.getElementById("chatbox");
    if (chatbox.value === "") return;

    postToNodeServer(Routes.SEND_MESSAGE_ROUTE, {
      from: username,
      to: friendUserName,
      message: chatbox.value,
      time: Date.now(),
    }).then((response) => {
      if (response.status === 200) {
        chatbox.value = "";
        updateUserData(dispatch, navigate);
      } else {
        console.log("error sending message", response);
      }
    });
  };

  return (
    <div className="row container-fluid gx-1 py-2">
      <div className="col-sm-11 col-md-10 col-lg-11 col-10 ">
        <input
          type="text"
          className="form-control-lg w-100"
          id="chatbox"
          placeholder="Enter a message"
          autoComplete="off"
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
        />
      </div>
      <div className="col-sm-1 col-md-2 col-lg-1 col-2">
        <button
          className="btn btn-success btn-sm w-100 h-100"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
