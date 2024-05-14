FROM python:3.11-slim-bookworm
COPY --from=denoland/deno:bin-1.43.3 /deno /usr/local/bin/deno

EXPOSE 8080:8080

WORKDIR /app
COPY . /app

RUN deno cache index.ts

# You might be wondering what the point of using Deno is if I'm just going to
# remove all the security features.
CMD deno run -A index.ts
