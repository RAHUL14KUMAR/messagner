require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./Database/db");
const authRouter = require("./routers/authRouter");

const app = express();
app.use(express.json());
app.use(cors())
const server = require("http").createServer(app);

const port = process.env.PORT || 4000;

const io = require("socket.io")(server, {
  cors:{
    origin:"http://localhost:3000/"
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.use("/auth", authRouter);

io.on("connection", async (socket) => {});

connect();
server.listen(port, () => {
  console.log(`server active at http://localhost:${port}`);
});
