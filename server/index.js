require('dotenv').config();
const express = require("express");
const { Server } = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const connect=require("./Database/db")
const authRouter = require("./routers/authRouter");

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: "true",
  },
});

const port=process.env.PORT;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.json("hi");
});

io.on("connection",async(socket)=>{
    
})


connect();
server.listen(port, () => {
    console.log(`server active at http://localhost:${port}`);
});