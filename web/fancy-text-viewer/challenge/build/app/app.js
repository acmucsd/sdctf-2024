import express from 'express';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';
import bot_goto from './bot.js';

function randomstring(length) {
    const chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function randomhexstring(length) {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

const app = express();
const ADMIN_PASSWORD = randomstring(64);
console.log(ADMIN_PASSWORD);
const FLAG = fs.readFileSync("flag.txt", "utf8");

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

app.set("view engine", "ejs");
app.use(cookieParser());
app.use('/static', express.static('public'))

app.use((req, res, next) => {
    for (const key in req.query) {
        let value = req.query[key];
        delete req.query[key];
        req.query[key.toLowerCase()] = value;
    }
    next();
});

function sanitize(str) {
    str = str.replace(/[^(0-Z. )]/g, "");
    return DOMPurify.sanitize(str);
}

app.get("/", (req, res) => {
    const sharedby = sanitize(req.query.sharedby || "");
    const username = req.cookies.username || "GUEST";
    const flag = req.cookies.flag || "";
    res.render("index", { sharedby, username, flag });
});

app.get("/login", (req, res) => {
    const secret = req.query.secret || "";
    if (secret !== ADMIN_PASSWORD) {
        res.status(401).send("login fail");
    } else {
        res.cookie("username", "ADMIN");
        res.cookie("flag", FLAG, { httpOnly: true });
        res.redirect("/");
    }
});

app.get("/view", (req, res) => {
    const content = req.query.content;
    const clrs = [];
    for (let i = 0; i < 4; i++) {
        clrs.push("#" + randomhexstring(6));
    }
    res.render("view", { content, clrs });
});

app.get("/redirect", (req, res) => {
    let url = req.query.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }
    res.redirect(url);
});

app.get("/bot", (req, res) => {
    const url = req.query.url;
    bot_goto(url, ADMIN_PASSWORD);
    res.send("OK");
});

app.listen(4444, "0.0.0.0", () => {
    console.log("Server is running on http://0.0.0.0:4444");
});
