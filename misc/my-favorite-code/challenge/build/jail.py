#!/usr/local/bin/python

import opcode
import base64
import dis

import marshal
import tempfile

import sys, os
import importlib.util

header = importlib.util.MAGIC_NUMBER + b'\x00' * 12

def get_instructions(func):
    return {x.opname for x in dis.Bytecode(func)}

def run(code):
    code = marshal.loads(code)
    instructions = get_instructions(code)
    if instructions != CHOICES:
        return False
    
    def runner():
        ...

    runner.__code__ = code
    runner()
    

CHOICES = set()

print("My favorite python opcode is COMPARE_OP!")
CHOICES.add('COMPARE_OP')
print("What is your favorite python opcode?")
op = input()

if op not in opcode.opmap:
    print("That opcode doesn't exist!")
    exit()

CHOICES.add(op)
print("I wonder what we can do with these...")
code = base64.b64decode(input())

if not run(code):
    print("I guess not much.")
else:
    print("WOW")
