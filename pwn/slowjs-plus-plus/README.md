## SlowJS++

| Author    | Category | Difficulty | Points | Solves | First Blood          |
| --------- | -------- | ---------- | ------ | ------ | -------------------- |
| Xia0o0o0o | Pwn      | Medium     | 472    | 2      | OrangeOrchardOrioles |


---

### Description

> SlowJS, slow life.
>
> _Sorry for the unintended solution again😭_
>
> > The challenge is deployed with Ubuntu 23.10. Please run `/readflag` to get the flag.

### Hints

> Bindiff `async_func_resume()`

### Challenge Files

[slowjspp.zip](dist)

### Build

```
cd challenge
docker build -t slowjspp ./
docker run -d --rm -e GZCTF_FLAG=sdctf{testflag} -p 12345:70 slowjspp:latest
```

connect to the challenge
```
nc 127.0.0.1 12345
```
