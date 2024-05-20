#!/bin/sh
echo $GZCTF_FLAG > /srv/app/flag.txt
unset GZCTF_FLAG
socat tcp-l:5000,fork,reuseaddr exec:"python /srv/app/jail.py"