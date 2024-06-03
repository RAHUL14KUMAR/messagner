import { useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { AccountContext } from "../AccountContext";

const useSocketSetup = () => {
    const { user,setUser } = useContext(AccountContext);

    const socket = io('http://localhost:4000',{
        autoConnect:false,
        auth: {
            token: `${user.user.token}`
        }
    });
    useEffect(() => {
        socket.connect();
        socket.on("connect_error", () => {
            setUser({ loggedIn: false });
        });
        return () => {
        socket.off("connect_error");
        };
    }, [setUser]);
};

export default useSocketSetup;