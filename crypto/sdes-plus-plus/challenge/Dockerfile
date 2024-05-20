# credit to HKCERT for template for this Dockerfile:
# https://github.com/hkcert-ctf/CTF-Challenges/blob/main/CTF-2023/08-rsa-trio/env/chall/Dockerfile
FROM ubuntu:jammy-20221101

RUN apt-get update && apt-get install -y python3 python3-pip python3-venv socat
RUN python3 -m venv /home/ctfuser/venv

WORKDIR /home/ctfuser
COPY flag.txt SDES.py SDESPlusPlus.py server.py /home/ctfuser/

RUN python3 -m compileall /home/ctfuser/

CMD socat TCP-LISTEN:1337,reuseaddr,fork EXEC:"stdbuf -i0 -o0 -e0 /home/ctfuser/venv/bin/python3 /home/ctfuser/server.py"

EXPOSE 1337