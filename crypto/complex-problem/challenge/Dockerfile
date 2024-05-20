FROM ghcr.io/w4terdr0p/w4terctf-2023/gmpy2:alpine

COPY xinetd.conf /etc/xinetd.conf
COPY --chown=ctf:ctf flag /home/ctf/flag
COPY --chown=ctf:ctf CRSA.py /home/ctf/CRSA.py

CMD xinetd -dontfork