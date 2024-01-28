import { createContext, useState } from "react";

const UserContext = createContext();
const RoomContext = createContext();

const Providers = ({ children }) => {
    const [user, setUser] = useState(null);
    const [room, setRoom] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <RoomContext.Provider value={{ room, setRoom }}>
                {children}
            </RoomContext.Provider>
        </UserContext.Provider>
    )
}

export { Providers, UserContext, RoomContext };