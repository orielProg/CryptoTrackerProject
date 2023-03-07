const jwt = require("jsonwebtoken");
const { getUserID } = require("../jwt_helper/jwt_functions");


const verify = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("Access denied");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

const authToken = async (req, res, next) => {
  const id = await getUserID(
    req.cookies.accessToken,
    req.cookies.refreshToken,
    res
  );
  if (!id) return;
  req.user_id = id;
  console.log(id);
  next();
};

module.exports = authToken;
