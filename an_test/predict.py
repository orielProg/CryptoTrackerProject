import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
import sys

def run(job):

    with open(job["coin"]+".json") as f:
        # with open('a.json', 'r') as f:
        data = json.load(f)
    df = np.array([price[-1] for price in data["prices"]])
    scaler = MinMaxScaler(feature_range=(0, 1))
    df = scaler.fit_transform(np.array(df).reshape(-1, 1))
    dates = np.array([price[0] for price in data["prices"]])

    def get_closest_elements(arr):
        new_arr = []
        for i in range(len(arr)-60):
            new_arr.append([arr[i:i+60, 0], dates[i+60]])
        return new_arr

    def create_test(arr):
        # choose 10 random numbers from 0 to 299
        r = np.random.randint(0, 600)
        test_arr = []
        y_test = []
        y = []
        for i in range(r, r+720):
            test_arr.append(arr[i:i+59, 0])
            y.append(arr[i+59])
        y_test.append([arr[r+719+69],arr[r+719+83]])
        return np.array(test_arr), np.array(y_test), np.array(y)

    X, y_test, y = create_test(df)

    # windowed_df = get_closest_elements(df)

    # def array_to_X_Y(dataframe):

    #     dates = np.array([date[1] for date in dataframe])

    #     middle_matrix = np.array([price[0][0:59] for price in dataframe])
    #     X = middle_matrix.reshape((len(dates), middle_matrix.shape[1], 1))

    #     Y = np.array([price[0][59] for price in dataframe])

    #     return dates, X.astype(np.float32), Y.astype(np.float32)

    # dates, X, y = array_to_X_Y(windowed_df)

    from tensorflow.keras.models import Sequential
    from tensorflow.keras.optimizers import Adam
    from tensorflow.keras import layers
    import tensorflow as tf

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

    model.fit(X, y,  epochs=job["epoch"], batch_size=job["batch_size"],
              verbose=0)

    from copy import deepcopy
    import math

    recursive_predictions = []

    for i in range(10):
        if i == 0:
            last_window = deepcopy(X[-1])
        else:
            last_window = last_window[1:]
            last_window = np.append(last_window, next_prediction)
            last_window = last_window.reshape(59, 1)
        next_prediction = model.predict(
            np.array([last_window]))
        next_prediction = next_prediction.flatten()
        recursive_predictions.append(next_prediction)

    def get_prediction(predicted_price, current_price):
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

    current_price = scaler.inverse_transform(
        np.array(X[-1][-1]).reshape(-1, 1))[0][0]
    prediction = float(scaler.inverse_transform(
        np.array(recursive_predictions)[-1].reshape(-1, 1))[0][0])
    real_prediction10h,real_prediction24h = float(scaler.inverse_transform(y_test[0][0].reshape(-1, 1))[0][0]),float(scaler.inverse_transform(y_test[0][1].reshape(-1, 1))[0][0])

    return f'current price: {current_price}, prediction: {prediction},real prediction after 10h : {real_prediction10h}real prediction after 24h : {real_prediction24h}'
    # os.remove(sys.argv[1])