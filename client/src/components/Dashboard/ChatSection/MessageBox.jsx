import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFriendData, Routes } from "../../../utils";
import { postToNodeServer } from "../../../utils";
import { io } from "socket.io-client";
import { ChatBox } from "./ChatBox";

// const ENDPOINT = "http://localhost:8080";
var socket;

export function MessageBox(props) {
  const username = useSelector((state) => state.userData.username);
  const friendUserName = useSelector((state) => state.activeChat.username);
  const dispatch = useDispatch();

  let lastDate = "";
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  //this effect will be applied only if the friendname and username change
  useEffect(() => {
    const getMessages = async () => {
      const response = await postToNodeServer(Routes.GET_MESSAGES_ROUTE, {
        username: username,
        friendUserName: friendUserName,
      });
      if (response.status === 200) setMessages([...response.messages]);
    };
    getMessages();

    if (!socketConnected) {
      socket = io();
      socket.emit("setup", username);
      socket.on("connected", () => {
        console.log("connected to socket");
        setSocketConnected(true);
      });
    }
  }, [username, friendUserName, socketConnected]);

  //this effect will be applied on every time messages change
  useEffect(() => {
    if (socketConnected) {
      socket.once("new message", (message) => {
        if (message.from === friendUserName)
          setMessages([...messages, message]);
        else getFriendData(dispatch);
      });
    }

    //scroll to bottom
    const messageBox = document.getElementById("messageBox");
    messageBox.scrollTop = messageBox.scrollHeight;
  }, [messages, socketConnected, friendUserName, dispatch]);

  const emitMessage = (message) => {
    if (socketConnected) {
      socket.emit("send message", message);
      console.log("emitted");
    }
    setMessages([...messages, message]);
  };

  return (
    <div className="container-fluid p-0 d-flex flex-column h-100 overflow-hidden">
      <div
        className="h-100 container-fluid px-2 d-flex flex-column"
        id="messageBox"
        style={{ overflowY: "scroll", backgroundColor: "inherit" }}
      >
        {messages.map((message) => {
          const isRecieved = message.from === friendUserName;

          const dateObject = new Date(message.time);
          dateObject.setSeconds(0, 0);

          let time = dateObject.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          //date in british year format
          let date = dateObject.toLocaleDateString("en-GB");
          if (date === lastDate) {
            date = "";
          } else {
            lastDate = date;
          }

          return (
            <div
              key={message.time + message.from + message.message}
              className="conatiner-fluid p-0 d-flex flex-column"
            >
              {date !== "" ? (
                <span
                  className="text-white mx-auto my-3 p-1 px-2"
                  style={{
                    width: "fit-content",
                    backgroundColor: "#3a3d3c",
                    borderRadius: "20px",
                  }}
                >
                  {date}
                </span>
              ) : (
                <></>
              )}
              <div
                className="m-1 p-2 d-flex"
                style={{
                  maxWidth: "50%",
                  width: "fit-content",
                  borderRadius: "25% 0",
                  alignSelf: isRecieved ? "flex-start" : "flex-end",
                  backgroundColor: isRecieved ? "#67604c" : "#1b1ba1",
                }}
              >
                <span className="m-0 text-break text-white fs-5">
                  {message.message}
                </span>
                <span
                  className="m-0 text-end align-self-end ms-3 mt-4"
                  style={{
                    fontSize: "10px",
                    color: isRecieved ? "#b6c4d1" : "#c4bd8f",
                  }}
                >
                  {time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <ChatBox emitMessage={emitMessage} />
    </div>
  );
}
