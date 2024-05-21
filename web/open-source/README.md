## open-source

| Author | Category | Difficulty | Points | Solves | First Blood    |
| ------ | -------- | ---------- | ------ | ------ | -------------- |
| Sean   | Web      | Easy       | 100    | 106    | thehackerscrew |

---

### Description

> "open source" in the sense that if you open inspect element and go to the source tab all the source code is there!
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

[dist.zip](dist)

### Deployment

```shell
$ npm install
$ npm run build
```
