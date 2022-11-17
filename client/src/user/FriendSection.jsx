import { SearchUser } from "./SearchUser";
import { FriendRequests } from "./FriendRequests";

export function FriendSection(props) {
  return (
    <div
      className="container-fluid h-100 p-0"
      style={{ backgroundColor: "#51557E" }}
    >
      <FriendRequests />
      <SearchUser />
    </div>
  );
}
