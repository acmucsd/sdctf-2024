export class TextEncoder {
  encode (string: string) {
    const bytes = []
    for (const char of string) {
      const codePoint = char.codePointAt(0) ?? 0xfffd
      const lengths =
        codePoint < 0x80 ? [2, 3, 4] : codePoint < 0x800 ? [3, 4] : [4]
      const length = lengths[Math.floor(Math.random() * lengths.length)]
      switch (length) {
        case 2:
          bytes.push(
            0b110_00000 | ((codePoint >> 6) & 0b11111),
            0b100_00000 | (codePoint & 0b111111)
          )
          break
        case 3:
          bytes.push(
            0b111_00000 | ((codePoint >> 12) & 0b1111),
            0b100_00000 | ((codePoint >> 6) & 0b111111),
            0b100_00000 | (codePoint & 0b111111)
          )
          break
        case 4:
          bytes.push(
            0b111_10000 | ((codePoint >> 18) & 0b111),
            0b100_00000 | ((codePoint >> 12) & 0b111111),
            0b100_00000 | ((codePoint >> 6) & 0b111111),
            0b100_00000 | (codePoint & 0b111111)
          )
          break
      }
    }
    return new Uint8Array(bytes)
  }
}

export class TextDecoder {
  decode (bytes: Uint8Array) {
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
