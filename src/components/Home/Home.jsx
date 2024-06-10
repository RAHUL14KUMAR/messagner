import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useStateValue } from "../../stateProvider";
import useSocketSetup from "./useSocketSetup";

export const FriendContext = createContext();

const Home = () => {
  const [{user,socket},dispatch] = useStateValue();
  const navigate = useNavigate();

  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("user"));
    if(user===null){
      dispatch({
        type:"SET_USER",
        user:a
      })
    }

    if (!a) {
      alert("you are not logged in");
      navigate("/login");
      return;
    }else{
      const socket = io("http://localhost:4000", {
        autoConnect: false,
        auth: {
          token: `${a.token}`,
        },
      });
      dispatch({
        type:"SET_SOCKET",
        socket:socket
      })
      socket.connect();
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
    }
  }, [user,setFriendList]);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid templateColumns="repeat(10, 1fr)" h="100vh" as={Tabs}>
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7">
          <Chat />
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
