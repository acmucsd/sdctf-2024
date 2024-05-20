#!/bin/python3

from SDESPlusPlus import SDESPlusPlus
import secrets
import binascii

with open("flag.txt", "r") as f:
    flag = f.read()

OPTIONS_MSG = """Select an option:
(E) Encrypt a message (max 16 bytes)
(D) Think you've broken the cipher? Try decrypting this 8 byte ciphertext (one try only)"""
QUERY_MSG = "What is the message you want to encrypt? (hex form)"
PROMPT_MSG = "> "
INVALID_MSG = "Invalid input."
TOO_LONG_MSG = "Message is too long."
QUOTA_DEPLETED_MSG = "Sorry, you have exhausted your message quota"
ENCRYPTED_DESCRIPTION_MSG = "Encrypted message:"
DECIPHER_MSG = """Okay, I'm going to give you a ciphertext in hex. If you can decrypt it, I'll give you the flag!
Here is your message:"""
ASK_DECRYPTED_MSG = "Decrypt this and tell me the original plaintext (in hex form):"

MAX_LENGTH = 16

message_quota = 2000

key = secrets.randbits(64)
sdes_instance = SDESPlusPlus(key)

while True:
    print(f"You are allowed to encrypt {message_quota} more messages.")
    print(OPTIONS_MSG)
    answer = input(PROMPT_MSG)
    if (answer.upper() == "E"):
        if message_quota == 0:
            print(QUOTA_DEPLETED_MSG)
            continue
        print(QUERY_MSG)
        pt_hex = input(PROMPT_MSG)
        pt = binascii.unhexlify(pt_hex)
        if len(pt) > MAX_LENGTH:
            print(TOO_LONG_MSG)
            continue
        ct = sdes_instance.encrypt(pt)
        ct_hex = binascii.hexlify(ct).decode()
        print(ENCRYPTED_DESCRIPTION_MSG)
        print(ct_hex)
        message_quota -= 1
    elif (answer.upper() == "D"):
        pt = secrets.token_bytes(8)
        ct = sdes_instance.encrypt(pt)
        ct_hex = binascii.hexlify(ct).decode()
        print(DECIPHER_MSG)
        print(ct_hex)
        print(ASK_DECRYPTED_MSG)
        answer = input(PROMPT_MSG)
        pt_guess = binascii.unhexlify(answer)
        if (pt_guess == pt):
            print(f"You win! Here's the flag: {flag}")
            break
        else:
            print("Sorry, that wasn't the plaintext. Better luck next time!")
            break
    else:
        print(INVALID_MSG)
        continue