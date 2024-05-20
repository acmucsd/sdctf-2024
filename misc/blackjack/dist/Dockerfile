FROM python:3.10 as chroot

RUN apt-get update && apt-get -y install socat
RUN mkdir -p /home/user/
WORKDIR /home/user

COPY app .

ENTRYPOINT [ "./init.sh" ]