FROM rust:1.48.0 AS builder

COPY definitely_safe_notebook_since_i_have_forbid_unsafe_code /definitely_safe_notebook_since_i_have_forbid_unsafe_code

RUN cd /definitely_safe_notebook_since_i_have_forbid_unsafe_code && cargo build --release

FROM ubuntu:23.10

COPY --chmod=500 --chown=ctf:ctf init.sh /init.sh

RUN apt update && \
    apt --no-install-recommends -y install xinetd && useradd -m ctf && groupadd -f ctf && \
    chmod +x /init.sh && \
    mkdir -p /home/ctf/lib/ && \
    cp -R /usr/lib/x86_64-linux-gnu /home/ctf/lib/ && \
    cp -R /usr/lib64 /home/ctf && \
    mkdir /home/ctf/dev  && \
    mknod /home/ctf/dev/null c 1 3 && \
    mknod /home/ctf/dev/zero c 1 5 && \
    mknod /home/ctf/dev/random c 1 8 && \
    mknod /home/ctf/dev/urandom c 1 9 && \
    chmod 666 /home/ctf/dev/* && \
    mkdir /home/ctf/bin && \
    chown -R ctf:ctf /home/ctf && \
    chmod -R 750 /home/ctf && \
    cp /bin/sh /bin/ls /bin/cat /bin/base64 /bin/timeout /bin/bash /home/ctf/bin/ && \
    mkdir -p /home/ctf/usr/libexec/coreutils/ && \
    cp /usr/libexec/coreutils/libstdbuf.so /home/ctf/usr/libexec/coreutils/libstdbuf.so

COPY xinetd.conf /etc/xinetd.conf
COPY --from=builder --chown=ctf:ctf /definitely_safe_notebook_since_i_have_forbid_unsafe_code/target/release/definitely_safe_notebook_since_i_have_forbid_unsafe_code /home/ctf/definitely_safe_todolist_since_i_have_forbid_unsafe_code
RUN chmod 500 /home/ctf/definitely_safe_todolist_since_i_have_forbid_unsafe_code

CMD [ "/usr/sbin/xinetd", "-dontfork" ]
