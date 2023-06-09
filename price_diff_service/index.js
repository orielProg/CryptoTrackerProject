const { MongoClient, ServerApiVersion } = require("mongodb");
const dotenv = require("dotenv");
const { getAssets } = require("./crypto_functions");

dotenv.config({ path: ".env" });
const client = new MongoClient(process.env.DB_CONNECT, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected successfully to DB");
  } catch (e) {
    console.log(e);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getUsers() {
  const users = await client
    .db("cryptotracker")
    .collection("users")
    .find({})
    .toArray();
  return users;
}

async function updateUsersAssets(users) {
  users.forEach(async (user) => {
    try {
      const wallets = user.wallets;
      const data = await getAssets(wallets, user._id);
      const update = { latestData: data };
      await client
        .db("cryptotracker")
        .collection("users")
        .updateOne({ _id: user._id }, { $set: update });
      console.log("Updated user: ", user._id);
    } catch (e) {
      console.log(e);
      console.log("Failed to update user: ", user._id);
    }
  });
}

(async () => {
  const TEN_MIN_MS = 600000;
  while (true) {
    try {
      await connectToDB();
      const users = await getUsers();
      console.log("Got users");
      await updateUsersAssets(users);
      await sleep(TEN_MIN_MS);
    } catch (e) {
      console.log(e);
      client.close();
    }
  }
})();
