import puppeteer from "puppeteer";

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const CHALL_URL = "http://127.0.0.1:4444"

export default async function bot_goto(url, password) {
    console.log(`Requesting ${url}`);
    try {
        const browser = await puppeteer.launch({
            args: [
                "--no-sandbox",
                "--disable-gpu",
                "--js-flags=--noexpose_wasm,--jitless"
            ],
            executablePath: "/usr/bin/google-chrome"
        });

        let page = await browser.newPage();
        await page.goto(CHALL_URL + "/login?secret=" + password);
        await sleep(1000)
        await page.close();
        await sleep(100)

        page = await browser.newPage();
        await page.goto(url);
        await sleep(10000)
        await page.close();
        await sleep(100)

    } catch (e) {
        console.log(`Request Failed (${url})`);
    }
}
