import { Player, Room } from "../../types/game";

const Leaderboard = ({
  room,
  selectUser,
}: {
  room: Room;
  selectUser: Player | null;
}) => {
  return (
    <div className="min-w-screen flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="w-full text-left text-2xl">Leaderboard</h1>
      <div className="w-full gap-2">
        <div className="max-h-1/2 flex w-full flex-col items-center justify-between overflow-y-auto">
          {room.players
            .filter((p) => !p.isHost)
            .sort((a, b) => b.score - a.score)
            .map((player, index) => (
              <div
                key={player.id}
                className={`${
                  player.id == selectUser.id
                    ? "bg-gray-100 font-bold text-[#3761e2]"
                    : index < 3 && room.players.length > 3
                      ? "font-bold"
                      : ""
                }
                            flex h-[3.5rem] w-full flex-row items-center justify-between gap-2 rounded-lg px-4`}
              >
                <p>{index + 1}.</p>
                <p className="flex-1 text-left">{player.username}</p>
                <p className="pill m-0 w-36 border-none text-center">
                  {player.score}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
