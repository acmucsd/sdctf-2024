**Author:** Sean<br>
**Difficulty:** Easy<br>
**Category:** Web

---

I made a calculator! I'm using Python to do the math since I heard it's strongly typed, so my calculator should be pretty safe. Download the source code by clicking the download button above!

---

Flag format: `sdctf{...}`

To connect, click the "Create" button. Install [`wsrx`](https://github.com/XDSEC/WebSocketReflectorX/releases), then connect to the `wss://` URL. If you're using the CLI, the output will have something like,

```
Hi, I am not RX, RX is here -> 127.0.0.1:<PORT>
```

That's `wsrx`'s wacky way of saying you can open `http://127.0.0.1:<PORT>/` in your browser.

## Deployment

```shell
$ deno run -A index.ts
```

Flag template: `sdctf{there_was_once_a_cpp_stackoverflow_guy_who_was_super_pedantic_about_floats}`
