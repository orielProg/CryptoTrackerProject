import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
import sys
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from copy import deepcopy
import math
import matplotlib.pyplot as plt
import datetime

PREDICTION_HOURS = 10


def reshape_data(job):
    with open(job["filename"]) as f:
        data = json.load(f)
    prices_arr = np.array([price[-1] for price in data["prices"]])
    dates_arr = np.array([date[0] for date in data["prices"]])
    scaler = MinMaxScaler(feature_range=(0, 1))
    transformed_data = scaler.fit_transform(np.array(prices_arr).reshape(-1, 1))
    return transformed_data,scaler,dates_arr

def get_closest_elements(arr):
    new_arr = []
    for i in range(len(arr)-60):
        new_arr.append([arr[i:i+60, 0]])
    return new_arr
    
def create_test(scaled_prices):
    r = np.random.randint(0, 600)
    test_arr = []
    y_test = []
    y = []
    for i in range(r, r+720):
        test_arr.append(scaled_prices[i:i+59, 0])
        y.append(scaled_prices[i+59])
    y_test.append([scaled_prices[r+719+60]])
    return np.array(test_arr), np.array(y_test), np.array(y)

def get_train_data(scaled_prices):
    middle_matrix = np.array([price[0][0:59] for price in scaled_prices])
    X = middle_matrix.reshape((len(scaled_prices), middle_matrix.shape[1], 1))

    Y = np.array([price[0][59] for price in scaled_prices])

    return X.astype(np.float32), Y.astype(np.float32)

def get_model(job,X):
    model = Sequential()
    model.add(layers.LSTM(units=50, return_sequences=True,
              input_shape=(X.shape[1], 1)))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.LSTM(units=50, return_sequences=True))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.LSTM(units=50))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.Dense(units=1))

    model.compile(loss=job["loss"],
                  optimizer='adam')
    return model

def get_recursive_predictions(model,X):
    recursive_predictions = []

    for i in range(PREDICTION_HOURS):
        if i == 0:
            last_window = deepcopy(X[-1])
        else:
            last_window = last_window[1:]
            last_window = np.append(last_window, next_prediction)
            last_window = last_window.reshape(59, 1)
        next_prediction = model.predict(
            np.array([last_window]),verbose=0)
        next_prediction = next_prediction.flatten()
        recursive_predictions.append(next_prediction)
    return recursive_predictions

def get_prediction_string(predicted_price, current_price):
    change = ((predicted_price - current_price) / current_price)*100
    if math.fabs(change) < 1:
        return "neutral"
    if change >= 1 and change < 4:
        return "buy"
    if change >= 4:
        return "strong buy"
    if change <= -1 and change > -4:
        return "sell"
    return "strong sell"

def main(job):
    scaled_prices,scaler,dates_arr = reshape_data(job)
    if job.get("test",False):
        X, y_test, Y = create_test(scaled_prices)
    else:
        scaled_prices = get_closest_elements(scaled_prices)
        X,Y = get_train_data(scaled_prices)

    prediction_model = get_model(job,X)

    prediction_model.fit(X, Y,  epochs=job["epoch"], batch_size=job["batch_size"],
              verbose=0)
    
    train_predictions = prediction_model.predict(X).flatten()
    train_predictions = scaler.inverse_transform(train_predictions.reshape(-1,1)).reshape(train_predictions.shape)
    Y = scaler.inverse_transform(Y.reshape(-1,1)).reshape(Y.shape)
    dates_arr = dates_arr[:train_predictions.shape[0]]
    dates_arr = [datetime.datetime.fromtimestamp(int(timestamp)/1000) for timestamp in dates_arr]
    plt.plot(dates_arr, train_predictions)
    plt.plot(dates_arr, Y)
    plt.legend(['Training Predictions', 'Training Observations'])

def run_production():
    job = {
        "filename" : "bitcoin.json",
        "loss" : "mean_absolute_error",
        "dropout" : 0.2,
        "batch_size" : 32,
        "epoch" : 20
    }
    print(main(job))

run_production()