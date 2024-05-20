#!/bin/bash

echo $GZCTF_FLAG > /home/ctf/flag
chown -R ctf:ctf /home/ctf/flag
export GZCTF_FLAG=""

stdbuf -i0 -o0 -e0 /usr/sbin/chroot --userspec=1001:1001 /home/ctf /definitely_safe_todolist_since_i_have_forbid_unsafe_code
