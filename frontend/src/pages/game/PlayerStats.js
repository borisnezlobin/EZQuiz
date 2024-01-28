const PlayerStats = ({ player }) => {
    return (
        <div className="absolute top-4 right-4 flex flex-row justify-center items-center">
            <h1 className="text-4xl">{player.username}</h1>
            <p className="border border-gray-500 rounded-full py-1 px-2 text-sm">{player.score}</p>
        </div>
    )
}

export default PlayerStats;