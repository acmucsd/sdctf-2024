import requests
import json

from hashlib import sha256
import os

from dotenv import load_dotenv
load_dotenv()

USER = "integration"
PASSWORD = os.environ.get("PASSWORD")
INSTANCE = os.environ.get("INSTANCE")

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
}


def delete_user(user_id):
    response = requests.delete(
        f"{INSTANCE}/api/now/table/sys_user/{user_id}",
        headers=headers,
        auth=(USER, PASSWORD),
    )

    return response.status_code == 204

def get_user_sysid(username):
    response = requests.get(
        f"{INSTANCE}/api/now/table/sys_user?sysparm_query=user_name={username}&sysparm_fields=sys_id&sysparm_limit=1",
        headers=headers,
        auth=(USER, PASSWORD),
    )

    obj = response.json()
    if "error" in obj:
        return None

    if len(obj["result"]) == 0:
        return None
    
    return obj["result"][0]['sys_id']

def create_user(username, password):
    data = {"user_name": username, "user_password": password}

    response = requests.post(
        f"{INSTANCE}/api/now/table/sys_user?sysparm_input_display_value=true",
        headers=headers,
        data=json.dumps(data),
        auth=(USER, PASSWORD),
    )

    obj = response.json()
    if "error" in obj:
        return False
    return True