import json
import itertools

results = []
tests = []
with open("results2.txt", "r") as file:
    # Iterate over each line in the file
    for line in file:
        # Process each line
        results.append(line.strip())

for result in results:
    test = json.loads(result.split(",current")[0].replace("'", '"'))
    # if(test["batch_size"] == 32 and test["dropout"] == 0.2 and test["epoch"] == 20 and test["loss"] == "mean_absolute_error"):
    #     print(result)
    current_price = float(
        result.split(",current")[1].split(",")[0].split(":")[1].strip()
    )
    prediction = float(result.split(",current")[1].split(",")[1].split(":")[1].strip())
    realprice_after_10h = float(
        result.split(",current")[1].split(",")[2].split(":")[1].split("real")[0].strip()
    )
    realprice_after_24h = float(result.split(",current")[1].split(",")[2].split(":")[2].strip())
    tests.append(
        {
            "current_price": current_price,
            "prediction": prediction,
            "real prediction after 10h": realprice_after_10h,
            "real prediction after 24h": realprice_after_24h,
            **test,
        }
    )


def check_price_difference(float1, float2):
    threshold = 0.01  # 1% threshold

    # Calculate the absolute difference
    diff = abs(float1 - float2)

    # Calculate the relative difference
    relative_diff = diff / max(abs(float1), abs(float2))

    # Check if the relative difference is less than or equal to the threshold
    if relative_diff <= threshold:
        return True
    else:
        return False


def is_successful(test):
    if(test["batch_size"] == 32 and test["dropout"] == 0.2 and test["epoch"] == 20 and test["loss"] == "mean_absolute_error"):
        print(result)
    if (
        test["current_price"] <= test["prediction"]
        and test["real prediction after 10h"] >= test["current_price"]
    ):
        return True
    if (
        test["current_price"] >= test["prediction"]
        and test["real prediction after 10h"] <= test["current_price"]
    ):
        return True
    if check_price_difference(
        test["current_price"], test["prediction"]
    ) and check_price_difference(test["real prediction after 10h"], test["current_price"]):
        return True
    return False

def get_prediction(predicted_price, current_price):
        change = ((predicted_price - current_price) / current_price)*100
        if abs(change) < 1:
            return "neutral"
        if change >= 1 and change < 4:
            return "buy"
        if change >= 4:
            return "strong buy"
        if change <= -1 and change > -4:
            return "sell"
        return "strong sell"

def is_successful2(test):
    if(get_prediction(test["prediction"],test["current_price"]) == get_prediction(test["real prediction after 24h"],test["current_price"])):
        return True
    return False


for test in tests:
    test["successful"] = is_successful2(test)

results = tests
keys1 = ["dropout", "epoch", "loss","batch_size"]

def get_subsets_as_strings(data):
    subsets = []
    data = list(data.items())
    data.sort()
    
    for r in range(1,len(data) + 1):
        subsets.extend(list(itertools.combinations(data, r)))

    return subsets

a = {}
c=0

for result in results:
    subsets = get_subsets_as_strings({k: v for k, v in result.items() if k in keys1})
    for subset in subsets:
        subset = str(subset)
        if subset not in a:
            a[subset] = {"successful" : 0,"total" : 0}
        a[subset]["total"]+=1
        if result["successful"]:
            a[subset]["successful"]+=1

for a1 in a:
    a[a1]["success_rate"] = a[a1]["successful"]/a[a1]["total"]

b = list(a.items())
b.sort(key=lambda x: x[1]["success_rate"],reverse=True)

with open("a_results24h.txt", 'w') as file:
    # Iterate over the array and write each element to the file
    for element in b:
        file.write(str(element) + '\n')  # Write the element followed by a newline character

        


