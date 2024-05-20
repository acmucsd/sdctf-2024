#!/bin/sh

echo $GZCTF_FLAG > /home/ctf/flag 
chown -R ctf:ctf /home/ctf/flag
unset GZCTF_FLAG

/usr/sbin/sshd -D
