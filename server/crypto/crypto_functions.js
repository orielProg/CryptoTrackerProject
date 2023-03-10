const { Resolver } = require("dns");
const fetch = require("node-fetch");
const { Worker, workerData } = require("worker_threads");
const User = require("../model/User");

const activateWorkers = (wallets) => {
  if (wallets.length === 0) return [];
  let counter = 0;
  return new Promise((resolve, reject) => {
    let result = [];
    wallets.forEach((wallet) => {
      const worker = new Worker("./server/crypto/crypto_worker.js", {
        workerData: { wallet: wallet },
      });
      worker.on("message", (assets) => {
        counter++;
        result.push(assets);
        if (counter >= wallets.length) resolve(result);
      });
      worker.on("error", (err) => {
        console.log("Worker got the error");
        reject(err);
      });
    });
  });
};

const calculateChartData = (eth, erc20, nft, btc) => {
  let total = eth + erc20 + nft + btc;
  console.log(((eth + erc20 / total) * 100).toFixed(0), "HELLO");
  return [
    {
      type: "btc",
      total: btc === 0 && total === 0 ? 0 : ((btc / total) * 100).toFixed(1),
    },
    {
      type: "eth",
      total:
        eth === 0 && total === 0 && erc20 === 0
          ? 0
          : (((eth + erc20) / total) * 100).toFixed(1),
    },

    {
      type: "nft",
      total: nft === 0 && total === 0 ? 0 : ((nft / total) * 100).toFixed(1),
    },
  ];
};

const getAssets = async (wallets, id) => {
  let mainAssets = {};
  let flag = false;
  if (!wallets || wallets.length === 0) flag = true;
  if (!flag)
    await activateWorkers(wallets)
      .then((result) => {
        mainAssets = result;
      })
      .catch((err) => {
        console.log("Got the error bruh");
        throw err;
      });
  console.log("Trying although");
  if (!flag) mainAssets = mergeAssets(mainAssets);
  mainAssets = await calculateTotal(mainAssets, id);
  console.log(mainAssets);
  return mainAssets;
};

const mergeAssets = (mainAssets) => {
  let result = {};
  mainAssets.forEach((assets) => {
    //(2)
    for (let [key, value] of Object.entries(assets)) {
      //(3)
      if (result[key]) {
        //(4)
        result[key].amount += value.amount;
      } else {
        //(6)
        result[key] = value;
      }
    }
  });
  return result;
};

const calculateTotal = async (mainAssets, id) => {
  let arr = [];
  let ethTotal = 0,
    erc20Total = 0,
    nftTotal = 0,
    btcTotal = 0;
  console.log(mainAssets);
  let NFTtokens = 0,
    eth =
      Object.keys(mainAssets).length !== 0 && mainAssets.eth
        ? mainAssets.eth.amount.toFixed(2)
        : 0;
  let btc =
    Object.keys(mainAssets).length !== 0 && mainAssets.BTC
      ? mainAssets.BTC.amount.toFixed(6)
      : 0;
  if (mainAssets["eth"])
    delete Object.assign(mainAssets, { ["ETH"]: mainAssets["eth"] })["eth"];
  for (let [key, value] of Object.entries(mainAssets)) {
    if (value.type === "nft") NFTtokens++;
    let total;
    if (!value.price) value.price = 0;
    if (mainAssets[key].price) {
      total = +(value.amount * value.price).toFixed(2);
      console.log(key, total);
      mainAssets[key].price = parseFloat(mainAssets[key].price.toFixed(2));
      if (total && value.type === "eth") ethTotal += parseInt(total);
      else if (total && value.type === "erc20") erc20Total += parseInt(total);
      else if (total && value.type === "nft") nftTotal += parseInt(total);
      else if (total && value.type === "btc") btcTotal += parseInt(total);
    } else total = 0;
    arr.push({ ...value, name: key, total });
  }
  const user = await User.findOne({ _id: id });
  const latestCards = user.latestData.cards;
  console.log(latestCards);
  const totalCards = [
    {
      value:
        "$" + (ethTotal + erc20Total + nftTotal + btcTotal).toLocaleString(),
      number: ethTotal + erc20Total + nftTotal + btcTotal,
      trend:
        ethTotal + erc20Total + nftTotal + btcTotal - latestCards[0].number > 1
          ? "up"
          : "down",
      trendValue: !latestCards[0].number
        ? "0%"
        : Math.abs(
            ((ethTotal +
              erc20Total +
              nftTotal +
              btcTotal -
              latestCards[0].number) /
              latestCards[0].number) *
              100
          ).toFixed(0) + "%",
    },
    {
      value: btc,
      trend: btc / latestCards[1].value > 1 ? "up" : "down",
      trendValue: !latestCards[1].number
        ? "0%"
        : Math.abs(
            ((btc - latestCards[1].value) / latestCards[1].value) * 100
          ).toFixed(0) + "%",
    },
    {
      value: eth,
      trend: eth / latestCards[2].value > 1 ? "up" : "down",
      trendValue: !latestCards[2].number
        ? "0%"
        : Math.abs(
            ((eth - latestCards[2].value) / latestCards[2].value) * 100
          ).toFixed(0) + "%",
    },

    {
      value: NFTtokens,
      trend: NFTtokens / latestCards[3].value > 1 ? "up" : "down",
      trendValue: Math.abs(NFTtokens - latestCards[3].value),
    },
  ];
  return {
    chart: calculateChartData(ethTotal, erc20Total, nftTotal, btcTotal),
    assets: arr,
    cards: totalCards,
  };
};

const getValue = (assets) => {
  console.log(assets);
  let value = 0;
  for (let key in assets) {
    if (assets[key].price != null)
      value += assets[key].amount * assets[key].price;
  }
  console.log(value);
};

module.exports.getAssets = getAssets;
