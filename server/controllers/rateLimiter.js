const redisClient = require("../redis");

const rateLimiter = async (req, res, next) => {
  const ip = req.connection.remoteAddress.slice(0, 5);

  const [response] = await redisClient
  .multi()
  .incr(ip)
  .expire(ip, 60)
  .exec();

  console.log(response);
    if (response > 10) {
        res.json({
        message: "Too many requests slow down!!!",
        });
    }else{
        next();
    }

  // allow to run multiple query and command to our redis client to the same time
};

module.exports = rateLimiter;
