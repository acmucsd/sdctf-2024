FROM oven/bun:latest

RUN apt update && \
    apt install -y curl gnupg2

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && apt autoremove && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY ./app /app

COPY flag.txt /flag.txt

WORKDIR /app
RUN chmod +x init.sh
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true bun install

ENTRYPOINT ["./init.sh"]
