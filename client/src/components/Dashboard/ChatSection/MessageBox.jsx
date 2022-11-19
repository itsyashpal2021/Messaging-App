import { useEffect } from "react";
import { useSelector } from "react-redux";

export function MessageBox(props) {
  const friend = useSelector((state) => state.activeChat.username);
  const messages = useSelector((state) => state.user.messages).filter(
    (message) => message.to === friend || message.from === friend
  );

  useEffect(() => {
    //scroll to bottom
    const messageBox = document.getElementById("messageBox");
    messageBox.scrollTop = messageBox.scrollHeight;
  });

  return (
    <div
      className="h-100 container-fluid px-2 d-flex flex-column"
      id="messageBox"
      style={{ overflowY: "scroll", backgroundColor: "inherit" }}
    >
      {messages.map((message) => {
        const isRecieved = message.from === friend;
        return (
          <div
            key={message.time}
            className="p-2 text-white m-1"
            style={{
              maxWidth: "50%",
              borderRadius: "25% 0",
              backgroundColor: isRecieved ? "#67604c" : "#1b1ba1",
              alignSelf: isRecieved ? "flex-start" : "flex-end",
            }}
          >
            <p className="m-0 text-break">{message.message}</p>
          </div>
        );
      })}
    </div>
  );
}
