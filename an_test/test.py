import json
from pycoingecko import CoinGeckoAPI
import sys
import predict
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from time import sleep
load_dotenv()


DB_CONNECT = os.getenv("DB_CONNECT")

cg = CoinGeckoAPI()

coins = ["bitcoin", "ethereum"]

num_of_tests_per_coin = 10
losses = ["mean_absolute_error", "mean_squared_error"]
epoches = [7, 10, 20, 30]
batch_sizes = [16, 32, 64]
dropouts = [0.1, 0.2, 0.3]


def download_files():
    for coin in coins:
        with open(coin+".json", 'w') as outfile:
            json.dump(cg.get_coin_market_chart_by_id(
                coin, "usd", "60d"), outfile)


def create_jobs():
    jobs = []
    for coin in coins:
        for i in range(num_of_tests_per_coin):
            for loss in losses:
                for epoch in epoches:
                    for batch_size in batch_sizes:
                        for dropout in dropouts:
                            jobs.append({
                                "coin": coin,
                                "test_num": i,
                                "loss": loss,
                                "epoch": epoch,
                                "batch_size": batch_size,
                                "dropout": dropout
                            })
    with open("jobs" + '.json', 'w') as outfile:
        json.dump(jobs, outfile)
    print(len(jobs))

# create_jobs()
# download_files()


jobs = json.load(open("jobs.json"))
for job in jobs:
    result = predict.run(job)
    print(result)
    with open("results2", "a") as f:
        f.write(str(jobs[0])+","+result+"\n")
    jobs = jobs[1:]
    with open("jobs" + '.json', 'w') as outfile:
        json.dump(jobs, outfile)
    print(str(len(jobs)) + " jobs left")
