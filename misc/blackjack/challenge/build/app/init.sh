#!/bin/sh
export FLAG=$GZCTF_FLAG
unset GZCTF_FLAG
socat tcp-l:1337,fork,reuseaddr exec:"python main.py"