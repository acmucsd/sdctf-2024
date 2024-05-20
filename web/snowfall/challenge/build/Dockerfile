FROM python:3.11-slim-bookworm
ARG PUBLIC_KEY
ARG SNOW
ARG INSTANCE

RUN apt-get update && apt-get -y install socat

RUN mkdir -p /srv/app

RUN pip install --no-cache-dir PyNaCl
RUN pip install --no-cache-dir requests
RUN pip install --no-cache-dir python-dotenv

COPY main.py /srv/app/main.py
COPY snow.py /srv/app/snow.py
COPY init.sh /srv/app/init.sh


WORKDIR /srv/app
RUN chmod +x ./init.sh

ENV PUBLIC_KEY=$PUBLIC_KEY
ENV PASSWORD=$SNOW
ENV INSTANCE=$INSTANCE

ENTRYPOINT "/srv/app/init.sh"