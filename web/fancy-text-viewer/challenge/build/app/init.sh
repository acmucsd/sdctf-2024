#!/bin/sh
echo $GZCTF_FLAG > flag.txt
unset GZCTF_FLAG
PUPPETEER_DISABLE_HEADLESS_WARNING=true bun app.js