const mongoose = require("../server/node_modules/mongoose");
mongoose.set('strictQuery', true);
const request = require("supertest");
const dotenv = require("../server/node_modules/dotenv");
dotenv.config({ path: "./server/.env" });
const app = require("../server/utils")
const { MongoMemoryServer } = require("mongodb-memory-server");
const TopCoins = require("../server/model/TopCoins");
const {topcoinsResponse} = require("./topcoinsResponse");
let cookies = null;


describe("Server tests", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    TopCoins.insertMany(topcoinsResponse);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();

  });

  describe("No access token", () => {
    it("Should not access app", async () => {
      await request(app).get("/api/app/get-wallets").expect(401);
    })
  })
  

  describe("Register route", () => {
    it("Should register a user", async () => {
      await request(app)
        .post("/api/register")
        .send({
          username: "test123",
          email: "test@gmail.com",
          password: "123456",
          confirmPassword: "123456",
        }).expect(200);
        
    });
    it("Should not register a user", async () => {
      await request(app).post("/api/register").send({
        username: "test123",
        email: "dsadsad",
        password: "123456",
        confirmPassword: "123456",
      }).expect(400);
      
    })
  });

  describe("Login route", () => {
    it("Should login", async () => {
      const response = await request(app)
        .post("/api/login")
        .send({
          email: "test@gmail.com",
          password: "123456",
        }).expect(200);
        cookies = response.headers['set-cookie']
    });
    it("Should not login", async () => {
      await request(app).post("/api/login").send({
        email: "test",
        password: "123456",
      }).expect(400);
    })
  });

  describe("Wallets route", () => {
    it("Should change wallets", async () => {
        await request(app)
            .post("/api/app/change-wallets").set('Cookie', cookies)
            .send({
            wallets: [
                "0xf9e72A5Bf18b3b1e92F78513Bb790AEb2FA11736"
            ],
            }).expect(200);
        });

        it("Should not change wallets", async () => {
            await request(app)
                .post("/api/app/change-wallets").set('Cookie', cookies)
                .send({
                wallets: [
                    "abc"
                ],
                }).expect(406);
            });

        it("Should get wallets", async () => {
            const response = await request(app)
                .get("/api/app/get-wallets").set('Cookie', cookies)
                .expect(200);
            expect(response.body).toEqual(["0xf9e72A5Bf18b3b1e92F78513Bb790AEb2FA11736"]);
            });


    })

    describe("Tokens route", () => {
        it("Should get token graph", async () => {
          await request(app).post("/api/app/get-token-chart").set('Cookie', cookies).send({contractAddress:"eth"}).expect(200);
        });
        it("Should not get token graph", async () => {
          await request(app).post("/api/app/get-token-chart").set('Cookie', cookies).send({contractAddress:"testcoin"}).expect(404);
        });

        it("Should get topcoins", async () => {
          const response = await request(app).get("/api/app/get-top-coins").set('Cookie', cookies).expect(200);
          const numOfTopCoins = 7;
          expect(response.body.length).toEqual(numOfTopCoins);
          expect(response.body[0].id).toEqual("bitcoin");
          expect(response.body[0].current_price!==undefined).toEqual(true);
          expect(response.body[0].price_change_percentage_1h_in_currency!==undefined).toEqual(true);
        })

      //   it("Should get prediction for btc", async () => {
      //     const validPredictions = ["strong sell", "sell", "neutral", "buy", "strong buy","test_prediction"]
      //     const response = await request(app).get("/api/app/get-token-prediction?contractAddress=btc").set('Cookie', cookies).expect(200);
      //     console.log(response.body)
      //     expect(validPredictions.some((prediction) => prediction===response.body.result)).toEqual(true);
      // });

      it("Should not get prediction", async () => {
        const response = await request(app).get("/api/app/get-token-prediction?contractAddress=test").set('Cookie', cookies).expect(404);
    });
    });
});
