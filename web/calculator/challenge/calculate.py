import json
import sys


def evaluate(expression):
    if "value" in expression:
        return expression["value"]
    match expression["op"]:
        case "+":
            return evaluate(expression["a"]) + evaluate(expression["b"])
        case "-":
            return evaluate(expression["a"]) - evaluate(expression["b"])
        case "*":
            return evaluate(expression["a"]) * evaluate(expression["b"])
        case "/":
            return evaluate(expression["a"]) / evaluate(expression["b"])


print(json.dumps({"result": evaluate(json.loads(sys.argv[1]))}))
