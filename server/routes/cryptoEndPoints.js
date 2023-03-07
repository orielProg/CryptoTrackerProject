const User = require("../model/User");
const { getAssets } = require("../crypto/crypto_functions");
const authToken = require("./verifyToken");
const { db } = require("../model/User");
const { default: mongoose } = require("mongoose");
const { deleteTokens } = require("../jwt_helper/jwt_functions");
const router = require("express").Router();


const getSortingPipeline = (sortingModel) => {
    const key = "latestData.assets." + sortingModel[0].field;
    const value = sortingModel.sort === "asc" ? 1 : -1;
    return { key, value };
  };


router.get("/fetch-tokens", authToken, async (req, res, next) => {
  const _id = req.user_id;
  console.log(_id);
  const user = await User.findOne({ _id: _id });
  if (!user) return res.status(400).send("Error");
  const filter = { _id: _id };
  const wallets = user.wallets;
  let data;
  try {
    data = await getAssets(wallets, _id);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
  console.log("Why?");

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
  console.log("Cards is", cards);
  res.status(200).send(cards);
});

router.post("/logout", authToken, async (req, res) => {
    console.log("Trying to clear");
    deleteTokens(res);
    return res.status(200).send("Cleared");
  });

  router.post("/get-tokens", authToken, async (req, res) => {
    console.log("Requesting tokens");
    console.log(req.body);
    const _id = req.user_id;
    console.log(_id);
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
    console.log(pipeline);
    try {
      const cursor = db.collection("users").aggregate(pipeline);
      let assets = [];
      let size = 0;
      await cursor.forEach((doc) => assets.push(doc.latestData.assets));
      if (req.body.rowCount === 0) {
        const sizeCursor = db.collection("users").aggregate(sizePipeline);
        await sizeCursor.forEach((doc) => (size = doc.assetsSize));
      }
      return res.status(200).send({ assets, size });
    } catch (err) {
      return res.status(404).send(err.message);
    }
  });

module.exports = router;
