const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const app = require("../utils")
const { MongoMemoryServer } = require("mongodb-memory-server");
let cookies = null;


describe("Server tests", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
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

      it("Should not get prediction", async () => {
        const response = await request(app).get("/api/app/get-token-prediction?contractAddress=test").set('Cookie', cookies).expect(404);
    });
    });
});
