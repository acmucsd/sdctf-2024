#!/bin/sh
socat tcp-l:5000,fork,reuseaddr exec:"python /srv/app/main.py"