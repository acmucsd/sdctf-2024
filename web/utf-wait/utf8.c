#include "utf8.h"
#include <stdio.h>
#include <stdlib.h>

#define SANE 0

struct utf8 utf8_encode(int *codePoints, size_t n) {
  char *bytes = malloc(n * 4 * sizeof(char));
  size_t count = 0;
  char *curr = bytes;

  for (int i = 0; i < n; i++) {
    int codePoint = codePoints[i];
    // https://en.wikipedia.org/wiki/UTF-8#Encoding
    size_t length =
        SANE ? (codePoint < 0x80
                    ? 1
                    : codePoint < 0x800 ? 2 : codePoint < 0x010000 ? 3 : 4)
             : 4 - rand() % (codePoint < 0x80 ? 3 : codePoint < 0x800 ? 2 : 1);
    if (length == 1) {
      *(curr++) = codePoint;
    } else if (length == 2) {
      *(curr++) = 0b11000000 | ((codePoint >> 6) & 0b11111);
      *(curr++) = 0b10000000 | (codePoint & 0b111111);
    } else if (length == 3) {
      *(curr++) = 0b11100000 | ((codePoint >> 12) & 0b1111);
      *(curr++) = 0b10000000 | ((codePoint >> 6) & 0b11111);
      *(curr++) = 0b10000000 | (codePoint & 0b111111);
    } else if (length == 4) {
      *(curr++) = 0b11110000 | ((codePoint >> 18) & 0b111);
      *(curr++) = 0b10000000 | ((codePoint >> 12) & 0b111111);
      *(curr++) = 0b10000000 | ((codePoint >> 6) & 0b111111);
      *(curr++) = 0b10000000 | (codePoint & 0b111111);
    }
    count += length;
  }

  struct utf8 result = {.bytes = bytes, .n = count};
  return result;
}

struct utf32 utf8_decode(char *utf8, size_t n) {
  int *codePoints = malloc(n * sizeof(int));
  size_t count = 0;
  int *curr = codePoints;

  int expect = 0;
  int codePoint = 0;

  for (int i = 0; i < n; i++) {
    unsigned char byte = utf8[i];

    if (expect > 0) {
      if (byte >> 6 == 0b10) {
        codePoint <<= 6;
        codePoint |= byte & 0b111111;
        expect--;
        if (expect == 0) {
          *(curr++) = codePoint;
          count++;
        }
      } else {
        fprintf(stderr, "expected continuation byte %02x\n", byte & 0xff);
        *(curr++) = 0xfffd;
        count++;
      }
    } else {
      if (byte >> 5 == 0b110) {
        expect = 1;
        codePoint = byte & 0b11111;
      } else if (byte >> 4 == 0b1110) {
        expect = 2;
        codePoint = byte & 0b1111;
      } else if (byte >> 3 == 0b11110) {
        expect = 3;
        codePoint = byte & 0b111;
      } else if (byte >> 7 == 0b0) {
        *(curr++) = byte;
        count++;
      } else {
        fprintf(stderr, "expected first byte %02x\n", byte & 0xff);
        *(curr++) = 0xfffd;
        count++;
      }
    }
  }

  if (expect > 0) {
    fprintf(stderr, "expected completed sequence\n");
    *(curr++) = 0xfffd;
    count++;
  }

  struct utf32 result = {.codePoints = codePoints, .n = count};
  return result;
}

// int main() {
//   int codePoints[] = {104, 101, 108, 108,   111, 32,
//                       33,  32,  241, 32650, 32,  128522};
//   int count = sizeof(codePoints) / sizeof(codePoints[0]);

//   struct utf8 encoded = utf8_encode(codePoints, count);
//   struct utf32 decoded = utf8_decode(encoded.bytes, encoded.n);

//   printf("\"");
//   for (int i = 0; i < count; i++) {
//     printf("\\u{%x}", codePoints[i]);
//   }
//   printf("\"\n");
//   printf("\"");
//   for (int i = 0; i < decoded.n; i++) {
//     printf("\\u{%x}", decoded.codePoints[i]);
//   }
//   printf("\"\n");

//   fwrite(encoded.bytes, sizeof(encoded.bytes[0]), encoded.n, stdout);

//   free(encoded.bytes);
//   free(decoded.codePoints);
// }
