import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RoomContext, UserContext } from "../../context.tsx";
import Leaderboard from "./leaderboard.tsx";
import ordinal from "ordinal";

const PlayerEndGamePage = ({ data, room, player }) => {
  const nav = useNavigate();
  const { setRoom } = useContext(RoomContext);
  const { user, setUser } = useContext(UserContext);

  data.rank =
    room.players
      .filter((p) => !p.isHost)
      .sort((a, b) => b.score - a.score)
      .findIndex((p) => p.id === player.id) + 1;

  return (
    <div className="min-w-screen flex h-full min-h-screen w-full flex-col items-center justify-center gap-4 overflow-y-scroll">
      <h1 className="text-left text-6xl">
        {data.rank}
        {ordinal(data.rank)} place{data.rank < 4}!<br />
        <span className="text-lg font-bold">{user.score} points</span>
      </h1>

      {/* <hr className="w-full max-w-4/5" /> */}

      <div className="mt-8 w-full md:w-1/2">
        <Leaderboard room={room} selectUser={player} />
      </div>

      <button
        className="mt-8"
        onClick={() => {
          setUser(null);
          setRoom(null);
          nav("/");
        }}
      >
        Exit Game
      </button>
    </div>
  );
};

export default PlayerEndGamePage;
