import ordinal from "ordinal";
import { Player, Room } from "../../types/game";
import PlayerStats from "./PlayerStats.tsx";

const PlayerResultsPage = ({
  data,
  room,
  player,
}: {
  data: any;
  room: Room;
  player: Player;
}) => {
  // get rank in room
  data.rank =
    room.players
      .filter((p) => !p.isHost)
      .sort((a, b) => b.score - a.score)
      .findIndex((p) => p.id === player.id) + 1;

  return (
    <div className="min-w-screen flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-start gap-4">
        <p className="text-6xl font-bold text-green-800">
          + {data.pointsReceived}
        </p>
        <h2 className="font-bold">{data.totalPoints} points</h2>
        <p className="text-2xl">
          You're in{" "}
          <span className="code text-2xl font-bold">
            {data.rank}
            {ordinal(data.rank)}
          </span>{" "}
          place{data.rank < 3 ? "!" : ". Keep going!"}
        </p>
      </div>
      <PlayerStats />
    </div>
  );
};

export default PlayerResultsPage;
