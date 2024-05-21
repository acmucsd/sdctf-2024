## Def1nit3lysAfetoDol1st5iNc31hAveF0rb1dUnsafec0de

| Author    | Category | Difficulty | Points | Solves | First Blood          |
| --------- | -------- | ---------- | ------ | ------ | -------------------- |
| Xia0o0o0o | Pwn      | Medium     | 500    | 1      | OrangeOrchardOrioles |

---

### Description

> Definitely safe todolist since I have `#[forbid(unsafe_code)]`.
>
> > The challenge is deployed with Ubuntu 23.10.

### Challenge Files

[definitely_safe_todolist_since_i_have_forbid_unsafe_code](dist)

### Build

```
cd challenge
docker build -t Def1nit3lysAfetoDol1st5iNc31hAveF0rb1dUnsafec0de ./
docker run -d --rm -e GZCTF_FLAG=sdctf{testflag} Def1nit3lysAfetoDol1st5iNc31hAveF0rb1dUnsafec0de:latest
```
