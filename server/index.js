require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./Database/db");
const authRouter = require("./routers/authRouter");
const redisClient=require("./redis");
const authenticateToken=require('./middleware/authenticateToken');

const app = express();
app.use(express.json());
app.use(cors());
const server = require("http").createServer(app);

redisClient.on("error", (err) => console.log("Redis Client Error", err));

const port = process.env.PORT || 4000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRouter);

io.use(authenticateToken);

io.on("connection", async (socket) => {
  // console.log(`user:${socket.user.username}`)
  socket.join(socket.user._id);
  redisClient.HSET(`user:${socket.user.username}`,"connected","true","userid",
    `${socket.user._id}`)

  const friendLists=await redisClient.LRANGE(`friends:${socket.user.username}`,0,-1);
  socket.emit("friends",friendLists);

  // console.log("friend list",friendLists)

  const parsedFriendList = await parseFriendList(friendLists);
  // console.log("parsed friend lists",parsedFriendList);

  const friendRooms = parsedFriendList.map(friend => friend.userid);

  console.log(friendRooms)

  if (friendRooms.length > 0){
    socket.to(friendRooms).emit("connected", "true", socket.user.username);
  }

  socket.emit("friends", parsedFriendList);

  socket.on("add_friend",(friendName,cb)=>{
    addFriend(friendName,cb)
  })


  socket.on("disconnecting", () => onDisconnect());

  socket.on("disconnect",()=>{
    console.log(`user disconnected with info ${socket.user._id}`)
  })

  const onDisconnect=async()=>{
    await redisClient.HSET(
      `user:${socket.user.username}`,
      "connected",
      "false"
    );
    const friendList = await redisClient.LRANGE(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    const friendRooms = await parseFriendList(friendList).then(friends =>
      friends.map(friend => friend.userid)
    );
    socket.to(friendRooms).emit("connected", "false", socket.user.username);
  }

  const addFriend=async(friendName,cb)=>{
    // console.log(friendName);
  
    if(friendName===socket.user.username){
      cb({done:false,errorMsg:"can not add self"})
      return;
    }
    const friendUserId=await redisClient.HGET(`user:${friendName}`,"userid");
    // console.log("friend user id",friendUserId)
    

    const friend = await redisClient.HGETALL(`user:${friendName}`);
    console.log(friend)
  
    const currentFriendList=await redisClient.LRANGE(`friends:${socket.user.username}`,0,-1)
  
    if(!friendUserId){
      cb({done:false,errorMsg:"user doesnt exists"})
      return;
    }
  
    if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
      cb({ done: false, errorMsg: "Friend already added!" });
      return;
    }
  
    await redisClient.LPUSH(`friends:${socket.user.username}`, friendName);

    const newFriend = {
      username: friendName,
      userid: friend.userid,
      connected: friend.connected,
    };

    // console.log(friend)
    cb({ done: true,newFriend });
  }
})

const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendConnected = await redisClient.HGETALL(
      `user:${parsedFriend[0]}`
    );
    newFriendList.push({
      username: parsedFriend[0],
      userid: JSON.parse(friendConnected.userid),
      connected: friendConnected.connected,
    });
  }
  return newFriendList;
};

connect();

async function startServer() {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");

    server.listen(port, () => {
      console.log(`server active at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();

