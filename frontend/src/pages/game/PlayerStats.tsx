import { useContext } from "react";
import { RoomContext, UserContext } from "../../context.tsx";

const PlayerStats = () => {
  const { user } = useContext(UserContext);
  const { room } = useContext(RoomContext);

  return (
    <div className="absolute right-4 top-4 flex flex-row items-center justify-center gap-2">
      <h1 className="text-lg font-bold">{user.username}</h1>
      <p className="pill rounded-full border border-gray-500 px-2 py-1 text-sm">
        {user.score}
      </p>
    </div>
  );
};

export default PlayerStats;
