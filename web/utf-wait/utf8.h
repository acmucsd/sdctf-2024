#include <stdlib.h>

#ifndef _UTF8_H_
#define _UTF8_H_

struct utf32 {
  int *codePoints;
  // Number of Unicode code points
  size_t n;
};

struct utf8 {
  char *bytes;
  // Number of bytes
  size_t n;
};

// Encode `n` Unicode code points (i.e. UTF-32) as UTF-8
struct utf8 utf8_encode(int *codePoints, size_t n);

// Decode a UTF-8 string into Unicode code points
struct utf32 utf8_decode(char *utf8, size_t n);

#endif
