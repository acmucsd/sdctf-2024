## Snake

| Author    | Category | Difficulty | Points | Solves | First Blood |
| --------- | -------- | ---------- | ------ | ------ | ----------- |
| Xia0o0o0o | Pwn      | Easy       | 146    | 16     | BYU Cyberia |

---

### Description

> A simple snake game.
>
> > To connect to the challenge, please use `ssh root@ip -p port` with password `password` after creating the container.

### Challenge Files

[dist.zip](dist)

### Build

```
cd challenge
docker build -t snake ./
docker run -d --rm -e GZCTF_FLAG=sdctf{testflag} -p 12345:12345 snake:latest
```

connect to the challenge
```
ssh root@localhost -p 12345
```
