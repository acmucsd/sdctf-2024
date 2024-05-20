# UTF—wait.

The way UTF-8 is defined, it can allow characters to be encoded in multiple ways, so the specification explicitly requires decoders to reject these over-long encodings.

This uses its own text encoder that is presented as a cute naive developer that wants Unicode support for their web server. However, the encoder produces invalid UTF-8 encodings by always producing over-long character encodings. Proper UTF-8 decoders, like those used in browsers, will not accept these encodings and will display U+FFFD, the invalid encoding character.

To solve this challenge, users must realize the encoding scheme used by the web server:

- The title, "UTF-wait," suggests the challenge involves UTF-8.
- Only emojis, which require the full 4 bytes to be encoded, are rendered correctly in the browser.

Then, the user must make their own lenient UTF-8 decoder to inspect the website source. From looking at the HTML, they can see that the server gives notes when given a note name in the request body. But `flag` returns a 404 error.

The user must figure out that they have to encode `flag` the same way the server does. There are 16 possible ways it could be encoded, which is kind of a brute force but not really.

```js
class TextDecoder {
  decode (bytes) {
    let expect = 0
    let str = ''
    let codePoint = 0
    for (const byte of bytes) {
      if (expect > 0) {
        if (byte >> 6 === 0b10) {
          codePoint <<= 6
          codePoint |= byte & 0b111111
          expect--
          if (expect === 0) {
            str += String.fromCodePoint(codePoint)
          }
        } else {
          console.warn(
            'expected continuation byte',
            byte.toString(2).padStart(8, '0')
          )
          str += '\ufffd'
        }
      } else {
        if (byte >> 5 === 0b110) {
          expect = 1
          codePoint = byte & 0b11111
        } else if (byte >> 4 === 0b1110) {
          expect = 2
          codePoint = byte & 0b1111
        } else if (byte >> 3 === 0b11110) {
          expect = 3
          codePoint = byte & 0b111
        } else if (byte >> 7 === 0b0) {
          str += String.fromCodePoint(byte)
        } else {
          console.warn('expected first byte', byte.toString(2).padStart(8, '0'))
          str += '\ufffd'
        }
      }
    }
    if (expect > 0) {
      console.warn('expected completed sequence')
      str += '\ufffd'
    }
    return str
  }
}
const gg = char => {
  const codePoint = char.codePointAt(0) ?? 0xfffd
  return [
    [codePoint],
    [
      0b110_00000 | ((codePoint >> 6) & 0b11111),
      0b100_00000 | (codePoint & 0b111111)
    ],
    [
      0b111_00000 | ((codePoint >> 12) & 0b1111),
      0b100_00000 | ((codePoint >> 6) & 0b111111),
      0b100_00000 | (codePoint & 0b111111)
    ],
    [
      0b111_10000 | ((codePoint >> 18) & 0b111),
      0b100_00000 | ((codePoint >> 12) & 0b111111),
      0b100_00000 | ((codePoint >> 6) & 0b111111),
      0b100_00000 | (codePoint & 0b111111)
    ]
  ]
}
for (const f of gg('f'))
  for (const l of gg('l'))
    for (const a of gg('a'))
      for (const g of gg('g')) {
        console.log(
          await fetch('.', {
            method: 'POST',
            body: new Blob([new Uint8Array([f, l, a, g].flat())])
          })
            .then(r => r.arrayBuffer())
            .then(b => new TextDecoder().decode(new Uint8Array(b)))
        )
      }
```
