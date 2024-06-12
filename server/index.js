require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./Database/db");
const authRouter = require("./routers/authRouter");
const redisClient=require("./redis");
const authenticateToken=require('./middleware/authenticateToken');

const {onDisconnect, addFriend, parseFriendList, dm}=require('./controllers/SocketController');

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

  const parsedFriendList = await parseFriendList(friendLists);
  const friendRooms = parsedFriendList.map(friend => friend.userid);

  if (friendRooms.length > 0){
    socket.to(friendRooms).emit("connected", "true", socket.user.username);
  }

  socket.emit("friends", parsedFriendList);

  const msgQuery=await redisClient.LRANGE(`chat:${socket.user._id}`,0,-1)
  const messages=msgQuery.map(msgStr=>{
    const parsedStr=msgStr.split(".");
    return {to:parsedStr[0],from:parsedStr[1],content:parsedStr[2]}
  })

  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }

  socket.on("add_friend",(friendName,cb)=>{
    addFriend(socket,friendName,cb)
  })

  socket.on("dm", message => dm(socket,message));

  socket.on("disconnecting", () => onDisconnect(socket));
});
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

