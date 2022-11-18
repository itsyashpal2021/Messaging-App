import { useSelector } from "react-redux";
import { FriendDetails } from "./FriendDetails";

export function Chat(props) {
  const activeChat = useSelector((state) => state.activeChat);
  // const dispatch = useDispatch();

  return (
    <div
      className="container-fluid h-100 p-0"
      style={{
        backgroundColor: "rgb(33 48 58)",
      }}
    >
      {activeChat.username === undefined ? (
        <></>
      ) : (
        <div className="d-flex h-100 flex-column container-fluid p-0">
          <FriendDetails />
          <div
            className="h-100 container-fluid px-2"
            style={{ overflowY: "scroll", backgroundColor: "inherit" }}
          ></div>
          <div className="row container-fluid gx-1 py-2">
            <div className="col-sm-11 col-md-10 col-lg-11 col-10 ">
              <input type="text" className="form-control-lg w-100" />
            </div>
            <div className="col-sm-1 col-md-2 col-lg-1 col-2">
              <button className="btn btn-success btn-sm w-100 h-100">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
