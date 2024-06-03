import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AccountContext = createContext();

const UserContext = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ loggedIn: false, user: null });

    return (
        <AccountContext.Provider value={{ user, setUser }}>
        {children}
        </AccountContext.Provider>
    );
};

export default UserContext;
