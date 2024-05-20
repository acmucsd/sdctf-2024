#!/bin/sh
socat tcp-l:5000,fork,reuseaddr exec:"python /srv/app/jail.py"