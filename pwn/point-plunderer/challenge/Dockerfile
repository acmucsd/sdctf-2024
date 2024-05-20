# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM ubuntu:18.04

COPY init.sh /
RUN apt update && \
    apt --no-install-recommends -y install xinetd && useradd -m ctf && groupadd -f ctf && \
    chmod +x /init.sh && \
    mkdir -p /home/ctf/lib/ && \
    cp -R /usr/lib/x86_64-linux-gnu /home/ctf/lib/ && \
    cp -R /usr /home/ctf && \
    cp -R /lib /home/ctf && \
    cp -R /lib64 /home/ctf && \
    mkdir /home/ctf/dev  && \
    mknod /home/ctf/dev/null c 1 3 && \
    mknod /home/ctf/dev/zero c 1 5 && \
    mknod /home/ctf/dev/random c 1 8 && \
    mknod /home/ctf/dev/urandom c 1 9 && \
    chmod 666 /home/ctf/dev/* && \
    mkdir /home/ctf/bin && \
    chown -R ctf:ctf /home/ctf && \
    chmod -R 750 /home/ctf && \
    cp /bin/sh /bin/ls /bin/cat /home/ctf/bin/ && \
    mkdir -p /home/ctf/usr/libexec/coreutils/

COPY --chown=ctf:ctf chal /home/ctf/
RUN chmod 500 /home/ctf/chal

COPY xinetd.conf /etc/xinetd.conf

CMD [ "/usr/sbin/xinetd", "-dontfork" ]
