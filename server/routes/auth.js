const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const {
  registerSchema,
  loginSchema,
} = require("../validation");
const crypto = require("crypto");

const { getTokens} = require("../jwt_helper/jwt_functions");
const Token = require("../model/Token");
const sendEmail = require("../emailService/sendEmail");

const createUser = async (req) => {
  console.log(req);
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
    wallets: [],
    latestData: {
      chart: [
        { type: "eth", total: "0" },
        { type: "erc20", total: "0" },
        { type: "nft", total: "0" },
      ],
      assets: [],
      cards: [
        {
          alt: "worth",
          header: "Total worth",
          image:
            "https://imageio.forbes.com/blogs-images/ofx/files/2018/09/OFX3-iStock-492595743-1200x800.jpg?fit=bounds&format=jpg&width=960",
          value: "0" + "$",
          number: 0,
          trend: "up",
          trendValue: "0%",
        },
        {
          alt: "eth",
          header: "Total ETH",
          image: "https://logowik.com/content/uploads/images/ethereum3649.jpg",
          value: 0,
          trend: "up",
          trendValue: "0%",
        },
        {
          alt: "erc20",
          header: "ERC20 tokens",
          image:
            "https://qph.cf2.quoracdn.net/main-qimg-0c341d9663713c21c4e164107e2d440a-lq",
          value: 0,
          trend: "up",
          trendValue: 0,
        },
        {
          alt: "nft",
          header: "Number of NFTS",
          image:
            "https://www.coindesk.com/resizer/qPSlzd_QRiApfu7Fxic1sQD0E-I=/1200x628/center/middle/cloudfront-us-east-1.images.arcpublishing.com/coindesk/ROBDVO4PFNFULOLBIK3DGUO5KQ.jpg",
          value: 0,
          trend: "up",
          trendValue: 0,
        },
      ],
    },
    photoUrl: req.body.picture ? req.body.picture : "",
    googleID: req.body.googleID ? req.body.googleID : "",
  });
  const savedUser = await user.save();
  return savedUser._id;
};

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  const emailExist = await User.findOne({ email: req.body.email });
  const usernameExist = await User.findOne({ username: req.body.username });
  if (emailExist) return res.status(400).send("Email already exists");
  if (usernameExist) return res.status(400).send("Username already exists");
  console.log(req.body);
  await createUser(req);
  return res.status(200).send("User created");
});

router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or password are wrong");
  const validPass = await bcrypt.compare(req.body.password, user.password);

  if (!validPass) return res.status(400).send("Wrong password");

  await getTokens(req, res, user._id);
  res.status(200).send("Logged");
});

router.post("/google-login", async (req, res) => {
  const googleID = req.body.googleID;
  const googleUser = await User.findOne({ googleID });
  //the user is registered
  if (googleUser) {
    console.log("the user already registered via google");
    const _id = googleUser._id;
    await getTokens(req, res, _id);
    res.status(200).send("Logged");
  } else {
    const email = req.body.email;
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      const _id = emailExist._id;
      getTokens(req, res, _id);
      res.status(200).send("Logged");
    }
    const username = "google" + googleID;
    const password = Math.random().toString(36).slice(2);
    req.body.password = password;
    req.body.username = username;
    req.body.googleID = googleID;
    const _id = await createUser(req, res);
    await getTokens(req, res, _id);
    res.status(200).send("Logged");
  }
});

router.post("/password-reset", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({
      success: false,
      message: "The email does not exists on the system",
    });
  }
  const _id = user._id;
  let token = await Token.findOne({ email });
  try {
    if (!token) {
      token = crypto.randomBytes(32).toString("hex");
      const tokenObj = new Token({
        email,
        token,
      });
      await tokenObj.save();
    } else token = token.token;
    const link =
      "" + process.env.BASE_URL + "/password-reset/" + _id + "/" + token;
    //need to make sendEmail function implem
    await sendEmail(email, "Password reset to CryptoTracker", link);
    return res.status(200).send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Error has been occurred" });
  }
});

router.get("/password-reset/:userID/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const userID = req.params.userID;
    console.log(token, userID);
    const user = await User.findOne({ _id: userID });
    console.log(user);
    if (!user) {
      console.log("does not exists");
      return res
        .status(404)
        .send({ success: false, message: "The link has expired" });
    }
    const email = user.email;
    const tokenObject = await Token.findOne({ email });
    console.log(tokenObject);
    if (!tokenObject || tokenObject.token !== token) {
      console.log("does not exists");
      return res
        .status(404)
        .send({ success: false, message: "The link has expired" });
    }
    return res.status(200).send({ success: true });
  } catch (error) {
    return res
      .status(400)
      .send({ success: false, message: "Error has been occurred" });
  }
});


module.exports = router;
