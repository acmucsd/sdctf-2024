## Author's Solution

*[Full write-up](https://sheeptester.github.io/longer-tweets/sdctf24/#webopen-source)*

My approach would be to inspect element the text field, look for its event listeners. Clicking on the `index.js:1` brought me to the fake source code, and clicking on the minified code didn't take me to the function. But right clicking and saving the handler as a global variable did reveal its real contents, which I could search in the minified code.

![The ancestor event listeners for the text field include a submit event. I store it as a global variable.](https://sheeptester.github.io/longer-tweets/images/sdctf24/web/open-source/listeners.png)

Then, I would set a breakpoint in the event handler. Except for some reason in Chrome, it would take me back to the source mapped code, and it wouldn't even set the breakpoint on the right line. Interesting!

And in Firefox, because the minified code has a source map associated with it, it refuses to prettify the code.

![Firefox tooltip: Can't pretty print generated sources with valid sourcemaps. Please use the original sources.](https://sheeptester.github.io/longer-tweets/images/sdctf24/web/open-source/firefox-pretty.png)

It's pretty interesting how a broken source map can disrupt devtools. Nonetheless, it's pretty easy to disable them.

![Chrome devtools command palette: Disable JavaScript source maps](https://sheeptester.github.io/longer-tweets/images/sdctf24/web/open-source/disable.png)

Finally, I can set a breakpoint in the form `submit` event handler, try checking a flag on some random input, then evaluate the right-hand side of the `===` expression.

![Breakpoint set on flag checking line. The right-hand side is selected and evaluated in the console, revealing the flag: sdctf{not_particularly_interesting}](https://sheeptester.github.io/longer-tweets/images/sdctf24/web/open-source/debugger.png)

I didn't think the challenge was particularly interesting, and I was feeling uncreative, so I just set the flag to `sdctf{not_particularly_interesting}`.

## User-Submitted Writeups

- [San Diego CTF 2024 Writeup](https://siunam321.github.io/ctf/San-Diego-CTF-2024/) by [Siunam](https://siunam321.github.io/)
- [Concerned Capybaras Writeups San Diego CTF 2024](https://files.catbox.moe/kgtf8e.pdf) (PDF download) by Concerned Capybaras
