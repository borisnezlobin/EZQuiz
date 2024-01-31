import { FC, createContext, useState } from "react";
import type { Room, Player } from "./types/game.ts";
import ChildrenProps from "./types/children-props.ts";

type UserContextType = {
    user: Player | null,
    setUser: (user: Player) => void
};

const defaultUserContext: UserContextType = {
    user: null,
    setUser: () => { }
}

type RoomContextType = {
    room: Room | null,
    setRoom: (room: Room) => void
}

const defaultRoomContext: RoomContextType = {
    room: null,
    setRoom: () => { }
}

const UserContext = createContext<UserContextType>(defaultUserContext);
const RoomContext = createContext<RoomContextType>(defaultRoomContext);

const Providers: FC<ChildrenProps> = ({ children }) => {
    const [user, setUser] = useState<Player | null>(null);
    const [room, setRoom] = useState<Room | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <RoomContext.Provider value={{ room, setRoom }}>
                {children}
            </RoomContext.Provider>
        </UserContext.Provider>
    )
}

export { Providers, UserContext, RoomContext };