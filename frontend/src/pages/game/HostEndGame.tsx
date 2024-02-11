import { useNavigate } from "react-router-dom";
import Confetti from "../../components/confetti";
import { ArrowRight } from "@phosphor-icons/react";
import { Player } from "../../types/game";

const HostEndGame = ({ room }) => {
  const nav = useNavigate();
  var players = room.players.filter((player: Player) => !player.isHost);
  players.sort((a, b) => {
    return b.score - a.score;
  });

  return (
    <div className="min-w-screen flex h-full min-h-screen w-full flex-col items-center justify-center gap-4">
      {/* <h1>Congratulations {players[0].username}!</h1> */}
      <div className="flex h-full w-full flex-row items-center justify-around gap-4">
        <div className="flex w-1/3 flex-col items-center justify-center gap-4 pt-24">
          {/* 2nd place */}
          <h1 className="text-8xl text-gray-300">2st</h1>
          {players.length > 1 ? (
            <>
              <h1 className="text-3xl">
                {players.length > 1 ? players[1].username : ""}
              </h1>
              <p className="pill">{players[1].score}</p>
            </>
          ) : (
            <p>Nobody here!</p>
          )}
        </div>
        <div className="flex w-1/3 flex-col items-center justify-center gap-4">
          {/* 1st place */}
          <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-8xl text-gray-300">1st</h1>
            {players.length > 0 ? (
              <>
                <h1 className="text-3xl">
                  {players.length > 0 ? players[0].username : ""}
                </h1>
                <p className="pill">{players[0].score}</p>
              </>
            ) : (
              <p>Nobody here!</p>
            )}
          </div>
        </div>
        <div className="flex w-1/3 flex-col items-center justify-center gap-4">
          {/* 3rd place */}
          <div className="flex flex-col items-center justify-center gap-4 pt-32">
            <h1 className="text-8xl text-gray-300">3rd</h1>
            {players.length > 2 ? (
              <>
                <h1 className="text-3xl">
                  {players.length > 2 ? players[2].username : ""}
                </h1>
                <p className="pill">{players[2].score}</p>
              </>
            ) : (
              <p>Nobody here!</p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 flex flex-row items-center justify-center">
        <button onClick={() => nav("/")}>
          Exit Game <ArrowRight />
        </button>
      </div>
      <Confetti size="lg" />
    </div>
  );
};

export default HostEndGame;
