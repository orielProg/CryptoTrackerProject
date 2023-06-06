from pycoingecko import CoinGeckoAPI
import sys
import predict
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from time import sleep
load_dotenv()

import json

DB_CONNECT = os.getenv("DB_CONNECT")

cg = CoinGeckoAPI()

coins = "bitcoin,ethereum,binancecoin,ripple,cardano,solana,polkadot"

def get_top_coins_data():
    return cg.get_coins_markets(vs_currency='usd', ids=coins, order='market_cap_desc', per_page=100, page=1, sparkline=False, price_change_percentage='1h,24h,7d')

def get_coins_predictions(coins_data,new=False):
    for coin in coins_data:
        coin_id = coin['id']
        
        coin_data = cg.get_coin_market_chart_by_id(
            id=coin_id, vs_currency='usd', days=30) if not new else cg.get_coin_market_chart_by_id(
            id=coin_id, vs_currency='usd', days="max")
        with open(coin_id + '.json', 'w') as outfile:
            json.dump(coin_data, outfile)
        # run the prediction model
        prediction = predict.run(coin_id)
        print(prediction + coin_id)
        coin['prediction' if not new else "prediction_new"] = prediction

def upload_data_to_db(coins_data):
    #connect to mongodb atlas and upload the data
    client = MongoClient(DB_CONNECT)
    client['test']['topcoins'].delete_many({})
    client['test']['topcoins'].insert_many(coins_data)


if __name__ == '__main__':
    while True:
        coins_data = get_top_coins_data()
        print("got coins data")
        get_coins_predictions(coins_data)
        print("got predictions")
        upload_data_to_db(coins_data)
        print("uploaded to db")
        sleep(60*60*24)