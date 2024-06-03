import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";
// import useSocketSetup from "./useSocketSetup";
import { io } from "socket.io-client";
import { AccountContext } from "../AccountContext";

export const FriendContext = createContext();

const Home = () => {
  const navigate = useNavigate();
  const { user,setUser } = useContext(AccountContext);
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("user"));

    if (!a) {
      alert("you are not logged in");
      navigate("/login");
      return;
    }else{
      const socket = io("http://localhost:4000", {
        autoConnect: false,
        auth: {
          token: `${user.user.token}`,
        },
      });

      socket.connect();
    }
  }, []);
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
