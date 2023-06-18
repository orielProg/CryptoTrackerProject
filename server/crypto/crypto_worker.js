const { parentPort, workerData } = require("worker_threads");
const fetch = require("node-fetch");
const CoinGecko = require("coingecko-api");
const CoinGeckoClient = new CoinGecko();
const { validate } = require("bitcoin-address-validation");

let assets = {};
let ethDollarPrice;
const wallet = workerData.wallet;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

// populates the assets object with Ethereum and ERC20
// token information associated with the provided wallet address.
const getErc20Tokens = async (wallet) => {
  const apiUrl = "https://api.ethplorer.io/getAddressInfo/";
  const url = apiUrl + wallet + "?apiKey=EK-mqqwV-SxcQuum-jjU5j";
  let data;
  try {
    const response = await fetch(url);
    data = await response.json();
    if (data.error) throw new Error("API ERROR");
  } catch (err) {
    console.log(err);
    throw err;
  }
  const ethDiff = await CoinGeckoClient.coins.fetch("ethereum", {
    localization: false,
    tickers: false,
    community_data: false,
    developer_data: false,
    sparkline: false,
  });
  assets.eth = {
    amount: data.ETH.balance,
    price: data.ETH.price.rate,
    type: "eth",
    diff: ethDiff.data.market_data.price_change_percentage_24h
      ? parseFloat(ethDiff.data.market_data.price_change_percentage_24h)
      : 0,
    id: "eth",
  };
  const tokens = data.tokens;
  if (tokens) {
    tokens.forEach((token, index) => {
      const tokenName = token.tokenInfo.symbol;
      assets[tokenName] = {
        amount: token.balance / Math.pow(10, 18),
        price: token.tokenInfo.price.rate,
        type: "erc20",
        picture: token.tokenInfo.image
          ? "https://ethplorer.io" + token.tokenInfo.image
          : "https://etherscan.io/images/main/empty-token.png",
        diff: token.tokenInfo.price.diff
          ? parseFloat(token.tokenInfo.price.diff)
          : 0,
        id: token.tokenInfo.address,
      };
    });
  }
};

const getNftTokens = async (retryCounter=0) => {
  const apiUrl = "https://api.opensea.io/api/v1/collections?asset_owner=";
  const url = apiUrl + wallet + "&format=json";
  apiKeys = process.env.OPENSEA_API_KEYS.split(" ");
  try {
    const response = await fetch(url,{headers : {"x-api-key" : apiKeys[getRandomInt(0,apiKeys.length)]}});
    const data = await response.json();
    const type = "nft";
    if (data) {
      data.forEach((nft) => {
        const name = nft.name;
        const price = nft.stats.one_day_average_price;
        const amount = nft.owned_asset_count;
        const picture = nft.image_url;
        const diff = nft.stats.one_day_change
          ? parseFloat(nft.stats.one_day_change)
          : 0;
        assets[name] = {
          price: price * ethDollarPrice,
          amount: amount,
          type,
          picture,
          diff,
          id: name,
        };
      });
    }
  } catch (err) {
    if(retryCounter < 3){
      console.log("retrying opensea api call retry counter: ",retryCounter," error: ",err);
      await new Promise((resolve) => setTimeout(resolve, getRandomInt(1000, 5000)));
      getNftTokens(retryCounter+1);
    }
    else{
      console.log("done retrying")
    }
    return;
  }
};

const getBTC = async () => {
  const btcURL =
    "https://api.blockcypher.com/v1/btc/main/addrs/" + wallet + "/balance";
  try {
    const response = await fetch(btcURL);
    data = await response.json();
    if (data.error) throw new Error("API ERROR");
    const balance = data.balance / 100000000;
    const btcGecko = await CoinGeckoClient.coins.fetch("bitcoin", {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    });
    if (btcGecko.success === false) throw new Error("API ERROR");
    assets.BTC = {
      id: "btc",
      type: "btc",
      amount : balance,
      price: btcGecko.data.market_data.current_price.usd,
      diff: btcGecko.data.market_data.price_change_percentage_24h,
      picture: btcGecko.data.image.small,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

if (!validate(wallet))
  getErc20Tokens(wallet)
    .then(() => {
      if (assets && assets.eth && assets.eth.price)
        ethDollarPrice = assets.eth.price;
      getNftTokens().then(() => {
        parentPort.postMessage(assets);
      });
    })
    .catch((err) => {
      throw err;
    });
else {
  getBTC().then(() => {
    parentPort.postMessage(assets);
  });
}
