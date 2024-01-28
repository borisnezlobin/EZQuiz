import { createContext, useState } from "react";

const UserContext = createContext();

const Providers = ({ children }) => {
    const [user, setUser] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}

export { Providers, UserContext };