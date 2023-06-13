const User = require("../model/User");
const TopCoin = require("../model/TopCoins");
const { getAssets } = require("../crypto/crypto_functions");
const bcrypt = require("bcryptjs");
const authToken = require("./verifyToken");
const { db } = require("../model/User");
const { default: mongoose } = require("mongoose");
const { deleteTokens } = require("../jwt_helper/jwt_functions");
const router = require("express").Router();
const CoinGecko = require("coingecko-api");
const { getPrediction } = require("../prediction_model/getPrediction");
const CoinGeckoClient = new CoinGecko();
const fs = require("fs");
const axios = require("axios");

const getSortingPipeline = (sortingModel) => {
  const key =
    "latestData.assets." +
    (sortingModel.length !== 0 ? sortingModel[0].field : "price");
  const value =
    sortingModel.length !== 0 && sortingModel[0].sort === "asc" ? 1 : -1;
  return { key, value };
};

const btcRegex = new RegExp(
  "\\b(bc(0([ac-hj-np-z02-9]{39}|[ac-hj-np-z02-9]{59})|1[ac-hj-np-z02-9]{8,87})|[13][a-km-zA-HJ-NP-Z1-9]{25,35})\\b"
);

router.get("/fetch-tokens", authToken, async (req, res, next) => {
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const _id = req.user_id;
  const user = await User.findOne({ _id: _id });
  if (!user) return res.status(400).send("Error");
  const filter = { _id: _id };
  if(user.latestData && user.latestData.fetchTime && Date.now() - user.latestData.fetchTime < FIVE_MINUTES_MS) {
    return res.status(200).send({});
  }
  const wallets = user.wallets;
  let data;
  try {
    data = await getAssets(wallets, _id);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
  data.fetchTime = Date.now();
  const update = { latestData: data };
  await User.findOneAndUpdate(filter, update);
  res.status(200).send({});
});

router.get("/chart", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const user = await User.findOne({ _id: _id });
  if (!user) return res.status(400).send("Error");
  const chart = user.latestData.chart;
  res.status(200).send(chart);
});

router.get("/cards", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const user = await User.findOne({ _id: _id });
  if (!user) return res.status(400).send("Error");
  const cards = user.latestData.cards;
  res.status(200).send(cards);
});

router.post("/logout", authToken, async (req, res) => {
  deleteTokens(res);
  return res.status(200).send("Cleared");
});

router.post("/get-tokens", authToken, async (req, res) => {
  const _id = req.user_id;
  const page = req.body.page;
  const itemsPerPage = req.body.itemsPerPage;
  const { key, value } = getSortingPipeline(req.body.sortingModel);
  const pipeline = [
    { $match: { _id: mongoose.Types.ObjectId(_id) } },
    { $project: { "latestData.assets": 1 } },
    { $unwind: { path: "$latestData.assets" } },
    {
      $sort: {},
    },
    { $skip: itemsPerPage * page },
    { $limit: itemsPerPage },
  ];
  pipeline[3]["$sort"][key] = value;
  const sizePipeline = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(_id),
      },
    },
    {
      $project: {
        assetsSize: {
          $size: "$latestData.assets",
        },
      },
    },
  ];
  try {
    const cursor = db.collection("users").aggregate(pipeline);
    let assets = [];
    let size = 0;
    await cursor.forEach((doc) => assets.push(doc.latestData.assets));
      const sizeCursor = db.collection("users").aggregate(sizePipeline);
      await sizeCursor.forEach((doc) => (size = doc.assetsSize));
    
    return res.status(200).send({ assets, size });
  } catch (err) {
    return res.status(404).send(err.message);
  }
});

router.post("/get-token-chart", authToken, async (req, res) => {
  const contractAddress = req.body.contractAddress;
  const days = req.body.days ? req.body.days : 7;
  const data =
    contractAddress === "eth"
      ? await CoinGeckoClient.coins.fetchMarketChart("ethereum", {
          vs_currency: "usd",
          days,
        })
      : contractAddress === "btc"
      ? await CoinGeckoClient.coins.fetchMarketChart("bitcoin", {
          vs_currency: "usd",
          days,
        })
      : await CoinGeckoClient.coins.fetchCoinContractMarketChart(
          contractAddress,
          "ethereum",
          { vs_currency: "usd", days }
        );
  if (!data.success) return res.status(404).send(data.data.error);
  return res.status(200).send(data.data.prices);
});

router.post("/check-contract-address", authToken, async (req, res) => {
  const contractAddress = req.body.contractAddress;
  const data =
    contractAddress === "eth"
      ? await CoinGeckoClient.coins.fetch("ethereum", {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        })
      : contractAddress === "btc"
      ? await CoinGeckoClient.coins.fetch("bitcoin", {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        })
      : await CoinGeckoClient.coins.fetchCoinContractInfo(contractAddress);
  if (!data.success) return res.status(404).send(data.data.error);
  return res.status(200).send({
    diff: data.data.market_data.price_change_percentage_24h,
    symbol: data.data.symbol,
    name: data.data.name,
    price: data.data.market_data.current_price.usd,
    image: data.data.image.small,
  });
});

router.post("/change-password", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const oldPasswordInput = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  const user = await User.findOne({ _id: _id });
  const oldPassword = user.password;
  const oldPasswordValid = await bcrypt.compare(oldPasswordInput, oldPassword);
  if (!oldPasswordValid) {
    return res.status(400).send("Old password is wrong");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(newPassword, salt);
  await User.findOneAndUpdate({ _id: _id }, { password: hashedPass });
  return res.status(200).send("Password updated");
});

router.post("/change-wallets", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const newWallets = req.body.wallets;
  if (
    newWallets.some((wallet) => {
      if (!/^(0x){1}[0-9a-fA-F]{40}$/i.test(wallet) && !btcRegex.test(wallet)) {
        return true;
      }
    })
  ) {
    return res.status(406).send({
      success: false,
      message: "At least one of the wallets is not valid",
    });
  }
  await User.findOneAndUpdate({ _id: _id }, { wallets: newWallets });
  await User.findOneAndUpdate({ _id: _id }, { $set: { 'latestData.fetchTime': 0 } });
  return res.status(200).send("Wallets updated");
});

router.get("/get-wallets", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const user = await User.findOne({ _id: _id });
  const wallets = user.wallets;
  return res.status(200).send(wallets);
});

router.get("/get-picture", authToken, async (req, res, next) => {
  const _id = req.user_id;
  const user = await User.findOne({ _id: _id });
  const photoUrl = user.photoUrl;
  return res.status(200).send(photoUrl);
});

router.get("/get-token-prediction", authToken, async (req, res) => {
  const contractAddress = req.query.contractAddress;
  const days = 30;
  const data =
    contractAddress === "eth"
      ? await CoinGeckoClient.coins.fetchMarketChart("ethereum", {
          vs_currency: "usd",
          days,
        })
      : contractAddress === "btc"
      ? await CoinGeckoClient.coins.fetchMarketChart("bitcoin", {
          vs_currency: "usd",
          days,
        })
      : await CoinGeckoClient.coins.fetchCoinContractMarketChart(
          contractAddress,
          "ethereum",
          { vs_currency: "usd", days }
        );
  if (!data.success) return res.status(404).send(data.data.error);
  const unixTime = Math.round(new Date().getTime() / 1000);
  try {
    fs.writeFile(
      `${unixTime}.json`,
      JSON.stringify(data.data),
      "utf8",
      function async(err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          return console.log(err);
        }

        console.log("JSON file has been saved.");
      }
    );
    const prediction = await getPrediction(`${unixTime}`);
    console.log(prediction)
    return res.status(200).send({ result: prediction });
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-top-coins", authToken, async (req, res) => {
  const predictions = await TopCoin.find();
  res.status(200).send(predictions);
});

router.get("/health", (req, res) => {
  console.log("Health check");
  res.status(200).send("OK");
});

module.exports = router;
