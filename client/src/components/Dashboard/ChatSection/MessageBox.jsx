import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../../state/slices";

export function MessageBox(props) {
  const friendUserName = useSelector((state) => state.activeChat.username);
  const messages = useSelector(
    (state) => state.chatData.messages[friendUserName]
  );

  const dispatch = useDispatch();

  let lastDate = "";
  const date = new Date();
  const todayDate = date.toLocaleDateString("en-GB");

  date.setDate(date.getDate() - 1);
  const yesterdayDate = date.toLocaleDateString("en-GB");

  useEffect(() => {
    window.addEventListener(
      "popstate",
      function (event) {
        dispatch(setActiveChat({}));
      },
      { once: true }
    );
  }, [dispatch]);

  //this effect will be applied on every time messages change
  useEffect(() => {
    //scroll to bottom
    const messageBox = document.getElementById("messageBox");
    messageBox.scrollTop = messageBox.scrollHeight;
  }, [messages]);

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
                  {date === todayDate
                    ? "Today"
                    : date === yesterdayDate
                    ? "Yesterday"
                    : date}
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
    </div>
  );
}
