#!/bin/bash

echo $GZCTF_FLAG > /home/ctf/flag
chown -R ctf:ctf /home/ctf/flag
export GZCTF_FLAG=""

/usr/sbin/chroot --userspec=1000:1000 /home/ctf /chal
