const mongoose = require("../server/node_modules/mongoose");
const request = require("supertest");
const dotenv = require("../server/node_modules/dotenv");
dotenv.config({ path: "./server/.env" });
const { startServer } = require("../server/utils");
const app = require("../server/utils")
const { MongoMemoryServer } = require("mongodb-memory-server");
let cookies = null;

describe("all routes", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  

  describe("register route", () => {
    it("should register a user", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "test123",
          email: "test@gmail.com",
          password: "123456",
          confirmPassword: "123456",
        }).expect(200);
        
    });
    it("should not register a user", async () => {
      await request(app).post("/register").send({
        username: "test123",
        email: "dsadsad",
        password: "123456",
        confirmPassword: "123456",
      }).expect(400);
      
    })
  });

  describe("login route", () => {
    it("should login", async () => {
      const response = await request(app)
        .post("/login")
        .send({
          email: "test@gmail.com",
          password: "123456",
        }).expect(200);
        cookies = response.headers['set-cookie']
    });
    it("should not login", async () => {
      await request(app).post("/login").send({
        email: "test",
        password: "123456",
      }).expect(400);
    })
  });

  describe("wallets route", () => {
    it("should change wallets", async () => {
        await request(app)
            .post("/app/change-wallets").set('Cookie', cookies)
            .send({
            wallets: [
                "0xf9e72A5Bf18b3b1e92F78513Bb790AEb2FA11736"
            ],
            }).expect(200);
        });

        it("should not change wallets", async () => {
            await request(app)
                .post("/app/change-wallets").set('Cookie', cookies)
                .send({
                wallets: [
                    "abc"
                ],
                }).expect(406);
            });

        it("should get wallets", async () => {
            const response = await request(app)
                .get("/app/get-wallets").set('Cookie', cookies)
                .expect(200);
            expect(response.body).toEqual(["0xf9e72A5Bf18b3b1e92F78513Bb790AEb2FA11736"]);
            });


    })
});
