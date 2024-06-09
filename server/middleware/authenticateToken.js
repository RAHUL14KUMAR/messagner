const jwt = require("jsonwebtoken");
const user = require("../Schema/userSchema");
const redisClient = require("../redis");

async function authenticateToken(socket, next) {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("No token provided"));
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        socket.user = await user.findById(decoded.id).select("-password");

        if (socket.user === null) {
            throw new Error();
        }
        next();
    } catch (error) {
        // res.status(401);
        throw new Error("unauthorized");
    }
}

module.exports=authenticateToken;
