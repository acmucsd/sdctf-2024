#!/usr/local/bin/python

from base64 import b64decode
from nacl.signing import VerifyKey
import os

from snow import INSTANCE, create_user, delete_user, get_user_sysid
import secrets

PUBLIC_KEY = os.environ.get("PUBLIC_KEY")

print("THIS SERVER IS JUST TO OBTAIN A CONNECTION.")
print("PLEASE NOTE DOWN YOUR CREDENTIALS ONCE MADE.")
print("PLEASE DO NOT MADE ADDITIONAL ACCOUNT REQUESTS UNLESS ABSOLUTELY NECESSARY.")
print("IT IS NOT NEEDED FOR THE CHALLENGE, AND IT WILL SIMPLY GIVE YOU BACK THE SAME ACCOUNT RESET.")

token = input("Please enter your team token: ")
verify_key = VerifyKey(b64decode(PUBLIC_KEY))

data = f"GZCTF_TEAM_{token.split(':')[0]}".encode()

try:
    team = verify_key.verify(data, b64decode(token.split(":")[1])).decode()
except:
    print("Invalid token.")
    exit()

def new_account(team):
    password = secrets.token_urlsafe(32)
    if create_user(team, password):
        print(f"SERVICENOW ACCOUNT CREATED ON {INSTANCE}. PLEASE STORE THESE CREDENTIALS.")
        print(f'Username: {team}')
        print(f'Password: {password}')
        exit()
    else:
        print("Failed to create account, if this issue persists please contact an admin.")
        exit()

sys_id = get_user_sysid(team)
if not sys_id:
    new_account(team)

else:
    print(f"An account already exists for team {team}. Type (DELETE) to delete the account and create a new one.")
    if input(">>> ") == "DELETE":
        if delete_user(sys_id):
            new_account(team)
        else:
            print("Failed to delete account, if this issue persists please contact an admin.")
            exit()

