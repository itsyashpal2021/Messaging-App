import { SearchUser } from "../SearchUser";
import { FriendRequests } from "./FriendRequests";
import { FriendList } from "./FriendList";

export function FriendSection(props) {
  return (
    <div
      className="container-fluid h-100 p-0 d-flex flex-column"
      style={{ backgroundColor: "#51557E" }}
    >
      <FriendRequests />
      <SearchUser />
      <FriendList />
    </div>
  );
}
