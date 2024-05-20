## calculator

| Author | Category | Difficulty | Points | Solves | First Blood |
| ------ | -------- | ---------- | ------ | ------ | ----------- |
| Sean   | Web      | Easy       | 100    |        |             |

---

### Description

> I made a calculator! I'm using Python to do the math since I heard it's strongly typed, so my calculator should be pretty safe. Download the source code by clicking the download button above!
>
> ---
>
> Flag format: `sdctf{...}`
>
> To connect, click the "Create" button. Install [`wsrx`](https://github.com/XDSEC/WebSocketReflectorX/releases), then connect to the `wss://` URL. If you're using the CLI, the output will have something like,
>
> ```
> Hi, I am not RX, RX is here -> 127.0.0.1:<PORT>
> ```
>
> That's `wsrx`'s wacky way of saying you can open `http://127.0.0.1:<PORT>/` in your browser.

### Challenge Files

[dist.zip](challenge)

### Deployment

```shell
$ deno run -A index.ts
```
