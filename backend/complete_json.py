# given a string of json that is not finished complete the json such that it is valid and can be properly parsed
# to be used openai streaming api

def complete_json(input_json):
    out_json = input_json
    stack = []

    if input_json[-1] == ",":
        out_json = input_json[:-1]

    for i, char in enumerate(out_json):
        if char == '{':
            stack.append(char)
        elif char == '}':
            stack.pop()
        elif char == '"' and out_json[i-1] != '\\':
            if stack[-1] == '"':
                stack.pop()
            else:
                stack.append(char)
        elif char == '[':
            stack.append(char)
        elif char == ']':
            stack.pop()
    
    while stack:
        popped = stack.pop()
        if popped == "{":
            out_json += "}"
        elif popped == '"':
            out_json += '"'
        elif popped == "[":
            out_json += "]"
    
    return out_json


# test cases
print(complete_json('{"a": 1, "b": 2, "c": 3'))
print(complete_json('{"a": 1, "b": 2, "c": {"d": 3, "e": 4, "f": 5'))
print(complete_json('{"a": 1, "b": 2, "c": {"d": 3, "e": 4, "f": 5, "g": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,'))
print(complete_json('{"name": "eva'))
print(complete_json('{"family": {"size": 4, "members": [{ "name": "eva'))
