const { Worker } = require("worker_threads");
const axios = require("axios");

const activateWorkers = (wallets) => {
  if (wallets.length === 0) return [];
  let counter = 0;
  return new Promise((resolve, reject) => {
    let result = [];
    wallets.forEach((wallet) => {
      const worker = new Worker("./crypto_worker.js", {
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

const processCommonCards = (coin) => {
  return {
    value: "$" + coin.current_price.toLocaleString(),
    valueDecimal : coin.current_price,
    trend: coin.price_change_percentage_24h > 0 ? "up" : "down",
    trendValue: Math.abs(coin.price_change_percentage_24h).toFixed(2) + "%",
  };
};

const matchPricesFromCards = (mainAssets) => {
  mainAssets.assets.forEach((asset) => {
    if (asset.type === "btc") asset.price = mainAssets.cards[1].valueDecimal;
    else if (asset.type === "eth") asset.price = mainAssets.cards[2].valueDecimal;
  });
  return mainAssets
}

const getBtcAndEthData = async (mainAssets) => {
  url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d&locale=en";
  try {
    const response = await axios.get(url, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
    mainAssets.cards[1] = {...mainAssets.cards[1], ...processCommonCards(response.data[0])};
    mainAssets.cards[2] = {...mainAssets.cards[2], ...processCommonCards(response.data[1])};
    return matchPricesFromCards(mainAssets);    
  } catch (err) {
    console.log(err);
    return [];
  }
};

const mergeAssets = (mainAssets) => {
  let result = {};
  mainAssets.forEach((assets) => {
    for (let [key, value] of Object.entries(assets)) {
      if (result[key]) {
        result[key].amount += value.amount;
      } else {
        result[key] = value;
      }
    }
  });
  return result;
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
  mainAssets = await getBtcAndEthData(mainAssets);
  return mainAssets;
};

const calculateTotalTrend = (assets, total) => {
  let totalTrend = 0;
  assets.forEach((asset) => {
    totalTrend += (asset.total / total) * asset.diff;
  });
  return totalTrend;
};

const calculateTotal = async (mainAssets) => {
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
  totalTrend = calculateTotalTrend(
    arr,
    ethTotal + erc20Total + nftTotal + btcTotal
  );
  const totalCards = [
    {
      value:
        "$" + (ethTotal + erc20Total + nftTotal + btcTotal).toLocaleString(),
      number: ethTotal + erc20Total + nftTotal + btcTotal,
      trend: totalTrend >= 0 ? "up" : "down",
      trendValue: totalTrend.toFixed(2) + "%",
    },
    {
      value: btc,
      trend: "up",
      trendValue: "0%",
    },
    {
      value: eth,
      trend: "up",
      trendValue: "0%",
    },

    {
      value: NFTtokens,
      trend: "up",
      trendValue: "0%",
    },
  ];
  return {
    chart: calculateChartData(ethTotal, erc20Total, nftTotal, btcTotal),
    assets: arr,
    cards: totalCards,
  };
};

module.exports.getAssets = getAssets;
