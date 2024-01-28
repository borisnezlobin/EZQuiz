import PlayerStats from "./PlayerStats";

const getPostfix = (num) => {
    if (num === 1) {
        return "st";
    }
    if (num === 2) {
        return "nd";
    }
    if (num === 3) {
        return "rd";
    }
    return "th";
}

const PlayerResultsPage = ({ data, room, player }) => {

    return (
        <div className="w-full h-full min-w-screen min-h-screen gap-4 flex flex-col justify-center items-center">
            <h1 className="text-6xl text-left">
                {data.totalPoints} points<br />
                <span className="text-lg text-green-800 font-bold">+ {data.pointsReceived}</span>
            </h1>
            <PlayerStats player={player} />
            {/* <p className="mt-4">You're in {data.rank}{getPostfix(data.rank)} place{data.rank < 3 ? "!" : ". Keep going!"}</p> */}

        </div>
    )
}

export default PlayerResultsPage;