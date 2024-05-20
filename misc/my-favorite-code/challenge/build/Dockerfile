FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get -y install socat

RUN mkdir -p /srv/app

COPY jail.py /srv/app/jail.py
COPY init.sh /srv/app/init.sh

RUN chmod 755 /srv/app/init.sh

WORKDIR /srv/app

ENTRYPOINT ["/srv/app/init.sh"]