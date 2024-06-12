import { useContext, useEffect } from "react";
import { useStateValue } from "../../stateProvider";

const useSocketSetup = (setFriendList) => {
   const[{user,socket},dispatch]=useStateValue();

    
    useEffect(() => {
        console.log("from useSocket",socket)

        socket.on("friends",friendList=>{
            setFriendList(friendList);
        })
        socket.on("connected", (status, username) => {
            setFriendList(prevFriends => {
              return [...prevFriends].map(friend => {
                if (friend.username === username) {
                  friend.connected = status;
                }
                return friend;
              });
            });
          });
        socket.on("connect_error", () => {
            // setusernull
        });
        return () => {
            socket.off("connect_error");
        };
    }, [user,setFriendList]);
};

export default useSocketSetup;