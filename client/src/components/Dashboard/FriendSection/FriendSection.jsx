import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";
import { useEffect } from "react";
import { getFriendData } from "../../../utils";
import { useDispatch } from "react-redux";

export function FriendSection(props) {
  const dispatch = useDispatch();

  useEffect(() => {
    getFriendData(dispatch);
    const intervalId = setInterval(() => getFriendData(dispatch), 10000);
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div
      className="container-fluid h-100 p-0 d-flex flex-column"
      style={{ backgroundColor: "#51557E", overflowY: "scroll" }}
    >
      <FriendRequests />
      <SearchUser />
      <FriendList />
    </div>
  );
}
