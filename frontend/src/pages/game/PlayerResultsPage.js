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
            <h1 className="text-4xl">{data.points}</h1>
            <p>+ {data.newPoints}</p>
            <p className="mt-4">You're in {data.rank}{getPostfix(data.rank)} place{data.rank < 3 ? "!" : ". Keep going!"}</p>

        </div>
    )
}

export default PlayerResultsPage;