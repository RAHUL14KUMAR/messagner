const redisClient=require('../redis');

const onDisconnect=async(socket)=>{
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
async function parseFriendList(friendList){
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

const addFriend=async(socket,friendName,cb)=>{
    if(friendName===socket.user.username){
        cb({done:false,errorMsg:"can not add self"})
        return;
    }
    const friendUserId=await redisClient.HGET(`user:${friendName}`,"userid");
  
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
  
    cb({ done: true,newFriend });
}

const dm=async(socket, message)=>{
    message.from=socket.user._id;
    const messageString = [message.to, message.from, message.content].join(
        "."
    );
    await redisClient.LPUSH(`chat:${message.to}`, messageString)
    await redisClient.LPUSH(`chat:${message.from}`, messageString)
  
    socket.to(message.to).emit("dm", message);
}

module.exports={
    onDisconnect,
    addFriend,
    parseFriendList,
    dm
}