FROM ubuntu:22.04 AS builder

RUN apt update && apt install build-essential gcc libncurses-dev -y --no-install-recommends
COPY src/main.cpp /
RUN g++ main.cpp -o snake -lncurses

FROM ghcr.io/w4terdr0p/w4terctf-2023/xinetd:alpine

COPY --from=builder --chown=ctf:ctf /snake /snake
COPY --from=builder /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/libm.so.6
COPY --from=builder /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
COPY --from=builder /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so.2
COPY --from=builder /lib/x86_64-linux-gnu/libncurses.so.6 /lib/x86_64-linux-gnu/libncurses.so.6
COPY --from=builder /lib/x86_64-linux-gnu/libtinfo.so.6 /lib/x86_64-linux-gnu/libtinfo.so.6
COPY --from=builder /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30 /usr/lib/x86_64-linux-gnu/libstdc++.so.6
COPY --from=builder /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libgcc_s.so.1
COPY --from=builder /lib/x86_64-linux-gnu/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
COPY --from=builder /usr/share/terminfo /usr/share/terminfo
COPY init.sh /init.sh

RUN mkdir -p /home/ctf/lib/ && \
    cp -R /lib/x86_64-linux-gnu /home/ctf/lib/ && \
    cp -R /lib/ld-musl-x86_64.so.1 /home/ctf/lib/ && \
    cp -R /lib64 /home/ctf && \
    mkdir -p /home/ctf/usr/ && \
    cp -R /usr/lib /home/ctf/usr && \
    apk update && apk add openssh-server ncurses && chmod +x /init.sh && \
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
    cp snake /home/ctf && chmod 500 /home/ctf/snake && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /home/ctf/usr/share/terminfo && cp -av /etc/terminfo/* /home/ctf/usr/share/terminfo/

COPY --from=builder /usr/sbin/chroot /chroot
COPY sshd_config /etc/ssh/sshd_config
COPY run.sh /run.sh

RUN ssh-keygen -A && mkdir -p /run/sshd && echo 'root:password' | chpasswd && chmod +x /run.sh && chown ctf:ctf /home/ctf/snake

CMD [ "/init.sh" ]



