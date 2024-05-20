#!/bin/sh

echo $GZCTF_FLAG > /home/ctf/flag
chown -R root:root /home/ctf/flag
chmod 400 /home/ctf/flag
chmod +s /home/ctf/readflag
unset GZCTF_FLAG

echo -e 'Input you JavaScript code (end with "EOF")\n'
echo "" > /home/ctf/code.js

while read -t 30 input; do
    if [ "$input" = "EOF" ]; then
        break
    fi
    echo "$input" >> /home/ctf/code.js
done

chown -R ctf:ctf /home/ctf/code.js
/chroot --userspec=1000:1000 /home/ctf /run.sh
