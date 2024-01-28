const PlayerStats = ({ username, score }) => {
    return (
        <div className="absolute top-4 right-4 flex flex-row justify-center gap-2 items-center">
            <h1 className="font-bold text-lg">{username}</h1>
            <p className="border border-gray-500 rounded-full py-1 px-2 text-sm">{score}</p>
        </div>
    )
}

export default PlayerStats;