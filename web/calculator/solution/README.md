## Author's Solution

`json.dumps` outputs `NaN` and `Infinity`, which aren't syntax errors. You can still get `math.inf` by doing `1.0 / 5e-324`.

## User-Submitted Writeups

- [San Diego CTF 2024 Writeup](https://siunam321.github.io/ctf/San-Diego-CTF-2024/) by [Siunam](https://siunam321.github.io/)
