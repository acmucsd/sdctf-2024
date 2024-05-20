FROM denoland/deno:alpine-1.41.0

WORKDIR /app
COPY . /app

EXPOSE 10069:10069

RUN apk update
# https://github.com/prantlf/docker-alpine-make-gcc/blob/master/Dockerfile
RUN apk --no-cache add make gcc g++ musl-dev binutils autoconf automake libtool pkgconfig check-dev file patch

CMD ./make-flag-txt.sh && make run

# ??
