import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";

export const FriendContext = createContext();

const Home = () => {
  const navigate = useNavigate();
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const a = JSON.parse(localStorage.getItem("user"));

    if (!a) {
      alert("you are not logged in");
      navigate("/login");
      return;
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
