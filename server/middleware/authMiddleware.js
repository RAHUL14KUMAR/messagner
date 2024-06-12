const jwt = require("jsonwebtoken");
const user = require("../Schema/userSchema");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await user.findById(decoded.id).select("-password");
      if (req.user === null) {
        throw new Error();
      }
      next();
    } catch {
      res.status(401);
      throw new Error("unauthorized");
    }
  }
  if (!token) {
    res.status(400);
    throw new Error("unauthorized, no token");
  }
};

module.exports = protect;