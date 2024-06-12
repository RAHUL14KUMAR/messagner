import React, { useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import { Grid, GridItem, Tabs } from "@chakra-ui/react";
import { io } from "socket.io-client";
import { useStateValue } from "../../stateProvider";

export const FriendContext = createContext();
export const MessagesContext=createContext();

const Home = () => {
  const [{user,socket},dispatch] = useStateValue();
  const navigate = useNavigate();

  const [friendList, setFriendList] = useState([]);
  const [messages,setMessages]=useState([]);
  const [friendIndex, setFriendIndex] = useState(0);

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
      socket.on("messages", messages => {
        setMessages(messages);
      });
      socket.on("dm", message => {
        setMessages(prevMsgs => [message, ...prevMsgs]);
      });
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
          socket.off("connected");
          socket.off("friends");
          socket.off("messages");
          socket.off("dm");
      };
    }
  }, [user,setFriendList,setMessages]);
  return (
    <FriendContext.Provider value={{ friendList, setFriendList }}>
      <Grid
        templateColumns="repeat(10, 1fr)"
        h="100vh"
        as={Tabs}
        onChange={index => setFriendIndex(index)}
      >
        <GridItem colSpan="3" borderRight="1px solid gray">
          <Sidebar />
        </GridItem>
        <GridItem colSpan="7" maxH="100vh">
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <Chat userid={friendList[friendIndex]?.userid} />
          </MessagesContext.Provider>
        </GridItem>
      </Grid>
    </FriendContext.Provider>
  );
};

export default Home;
