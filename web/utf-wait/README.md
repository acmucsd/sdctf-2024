## utf-wait

| Author | Category | Difficulty | Points | Solves | First Blood |
| ------ | -------- | ---------- | ------ | ------ | ----------- |
| Sean   | Web      | Medium     | 352    | 7      | IrisSec     |

---

### Description

> 😊 I'm learning 🧠 how to make my own HTTP server in C! 🗺️ Here's my cool little journal 📖 website; try looking up `flag` 🚩! It doesn't work 💔 in some browsers, though. 🙇
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

### Hints

> Sorry for not clarifying this earlier 🙏, but making a few hundred 💯💯💯💯 requests in series 🚶 isn't considered fuzzing 👌 by our rules 📜 (I was told this should be obvious 🙄). That may be necessary for this challenge 🎮 because my friend 💃 says my server is a bit ⚠️nondeterministic⚠️! 😵‍💫

### Deployment

```shell
$ make build
$ make run
```
