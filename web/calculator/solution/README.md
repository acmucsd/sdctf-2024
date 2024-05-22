## Author's Solution

*[Full write-up](https://sheeptester.github.io/longer-tweets/sdctf24/#webcalculator)*

`json.dumps` outputs `NaN` and `Infinity`, which aren't valid JSON. You can still get `math.inf` by doing `1.0 / 5e-324`.

## User-Submitted Writeups

- [San Diego CTF 2024 Writeup](https://siunam321.github.io/ctf/San-Diego-CTF-2024/) by [Siunam](https://siunam321.github.io/)
