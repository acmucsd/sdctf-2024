FROM ubuntu:23.10 AS builder

RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

RUN apt-get update && apt-get install -y \
    tzdata python3 python3-pip git build-essential cmake libcurl4-gnutls-dev libpcre3-dev pkg-config \
    libreadline-dev libpcre2-dev libssl-dev unixodbc-dev coreutils --no-install-recommends && \
    git clone https://github.com/bellard/quickjs.git

COPY quickjs.diff /
RUN cd quickjs && git checkout 3b45d155c77bbdfe9177b1e03db830d2aff0b2a8 && git apply ../quickjs.diff && make

COPY readflag.c /readflag.c
RUN gcc -o /readflag /readflag.c

FROM ubuntu:23.10 AS dep
RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone
RUN apt-get update && apt-get install -y tzdata libcurl4-gnutls-dev libpcre3-dev libreadline-dev libpcre2-dev \
    libssl-dev unixodbc-dev --no-install-recommends

FROM ghcr.io/w4terdr0p/w4terctf-2023/xinetd:alpine

COPY init.sh /init.sh

COPY --from=builder /usr/libexec/coreutils/libstdbuf.so /usr/lib/x86_64-linux-gnu/coreutils/libstdbuf.so
COPY --from=builder /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2

RUN chmod +x /init.sh && \
    mkdir -p /home/ctf/lib/ && \
    mkdir -p /home/ctf/usr/lib/ && \
    mkdir /home/ctf/dev && \
    mknod /home/ctf/dev/null c 1 3 && \
    mknod /home/ctf/dev/zero c 1 5 && \
    mknod /home/ctf/dev/random c 1 8 && \
    mknod /home/ctf/dev/urandom c 1 9 && \
    chmod 666 /home/ctf/dev/* && \
    mkdir /home/ctf/bin && \
    chown -R ctf:ctf /home/ctf && \
    chmod -R 750 /home/ctf && \
    cp /bin/sh /bin/ls /bin/cat /home/ctf/bin/ && \
    mkdir -p /home/ctf/root && mkdir -p /home/ctf/tmp/.edbrowse && chown -R ctf:ctf /home/ctf/tmp && chown -R ctf:ctf /home/ctf/root && \
    mkdir -p /home/ctf/usr/libexec/coreutils/ && \
    cp /usr/lib/x86_64-linux-gnu/coreutils/libstdbuf.so /home/ctf/usr/libexec/coreutils/libstdbuf.so && \
    mkdir -p /home/ctf/lib64/ && cp /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /home/ctf/lib64/ld-linux-x86-64.so.2 && \
    cp /lib/ld-musl-x86_64.so.1 /home/ctf/lib/ld-musl-x86_64.so.1

COPY xinetd.conf /etc/xinetd.conf
COPY --from=dep /lib/x86_64-linux-gnu/ /home/ctf/lib
COPY --chmod=500 --chown=ctf:ctf run.sh /home/ctf/run.sh
COPY --from=dep /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
COPY --from=dep /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so.2
COPY --from=dep /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
COPY --from=dep /usr/sbin/chroot /chroot
COPY --from=builder --chown=root:root /readflag /home/ctf/readflag
COPY --from=builder --chown=root:root /quickjs/qjs /home/ctf/quickjs

CMD [ "xinetd", "-dontfork" ]
