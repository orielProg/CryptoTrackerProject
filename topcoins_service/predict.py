import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
import sys
from tensorflow.keras.models import Sequential
from tensorflow.keras import layers
from copy import deepcopy
import math
import os
import constant



def reshape_data(job):
    with open(job["filename"]) as f:
        data = json.load(f)
    prices_arr = np.array([price[-1] for price in data["prices"]])
    scaler = MinMaxScaler(feature_range=(0, 1))
    transformed_data = scaler.fit_transform(np.array(prices_arr).reshape(-1, 1))
    return transformed_data,scaler

def get_closest_elements(arr):
    new_arr = []
    for i in range(len(arr)-constant.WINDOW_SIZE):
        new_arr.append([arr[i:i+constant.WINDOW_SIZE, 0]])
    return new_arr
    
def create_test(scaled_prices):
    r = np.random.randint(0, constant.RANDOM_THRESHOLD)
    test_arr = []
    y_test = []
    y = []
    for i in range(r, r+constant.INPUT_SIZE):
        test_arr.append(scaled_prices[i:i+constant.WINDOW_SIZE-1, 0])
        y.append(scaled_prices[i+constant.WINDOW_SIZE-1])
    y_test.append([scaled_prices[r+constant.INPUT_SIZE-1+constant.WINDOW_SIZE]])
    return np.array(test_arr), np.array(y_test), np.array(y)

def get_train_data(scaled_prices):
    middle_matrix = np.array([price[0][0:constant.WINDOW_SIZE-1] for price in scaled_prices])
    X = middle_matrix.reshape((len(scaled_prices), middle_matrix.shape[1], 1))

    Y = np.array([price[0][constant.WINDOW_SIZE-1] for price in scaled_prices])

    return X.astype(np.float32), Y.astype(np.float32)

def get_model(job,X):
    model = Sequential()
    model.add(layers.LSTM(units=constant.NN_UNITS, return_sequences=True,
              input_shape=(X.shape[1], 1)))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.LSTM(units=constant.NN_UNITS, return_sequences=True))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.LSTM(units=constant.NN_UNITS))
    model.add(layers.Dropout(job["dropout"]))
    model.add(layers.Dense(units=1))

    model.compile(loss=job["loss"],
                  optimizer='adam')
    return model

def get_recursive_predictions(model,X):
    recursive_predictions = []
    for i in range(constant.PREDICTION_HOURS):
        if i == 0:
            last_window = deepcopy(X[-1])
        else:
            last_window = last_window[1:]
            last_window = np.append(last_window, next_prediction)
            last_window = last_window.reshape(constant.WINDOW_SIZE-1, 1)
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
    scaled_prices,scaler = reshape_data(job)
    if job.get("test",False):
        X, y_test, y = create_test(scaled_prices)
    else:
        scaled_prices = get_closest_elements(scaled_prices)
        X,Y = get_train_data(scaled_prices)

    prediction_model = get_model(job,X)

    prediction_model.fit(X, Y,  epochs=job["epoch"], batch_size=job["batch_size"],
              verbose=0)
    
    recursive_predictions = get_recursive_predictions(prediction_model,X)

    current_price = scaler.inverse_transform(
        np.array(X[-1][-1]).reshape(-1, 1))[0][0]
    predicted_price = float(scaler.inverse_transform(
        np.array(recursive_predictions)[-1].reshape(-1, 1))[0][0])
    if job.get("test",False):
        real_prediction24h = float(scaler.inverse_transform(y_test[0][0].reshape(-1, 1))[0][0])
        return f'current price: {current_price}, prediction: {predicted_price},price after X time : {real_prediction24h}'
    os.remove(job["filename"])
    return get_prediction_string(predicted_price,current_price)

def run_production():
    job = {
        "filename" : sys.argv[1]+".json",
        "loss" : "mean_absolute_error",
        "dropout" : 0.2,
        "batch_size" : 32,
        "epoch" : 20
    }
    print(main(job))

def run_topcoins_service(coin):
    job = {
        "filename" : coin+".json",
        "loss" : "mean_absolute_error",
        "dropout" : 0.2,
        "batch_size" : 32,
        "epoch" : 20
    }
    return main(job)

