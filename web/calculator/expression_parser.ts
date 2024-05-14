import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'

export type Expression =
  | { op: '+' | '-' | '*' | '/'; a: Expression; b: Expression }
  | { value: number }

type ParseResult = Generator<{ expr: Expression; string: string }>

function * parseFloat (string: string): ParseResult {
  for (const regex of [
    /[-+](?:\d+\.?|\d*\.\d+)(?:e[-+]?\d+)?$/,
    /(?:\d+\.?|\d*\.\d+)(?:e[-+]?\d+)?$/
  ]) {
    const match = string.match(regex)
    if (!match) {
      continue
    }
    const number = +match[0]
    if (Number.isFinite(number)) {
      yield {
        expr: { value: number },
        string: string.slice(0, -match[0].length)
      }
    }
  }
}
function * parseLitExpr (string: string): ParseResult {
  yield * parseFloat(string)
  if (string[string.length - 1] === ')') {
    for (const result of parseAddExpr(string.slice(0, -1))) {
      if (result.string[result.string.length - 1] === '(') {
        yield { ...result, string: result.string.slice(0, -1) }
      }
    }
  }
}
function * parseMulExpr (string: string): ParseResult {
  for (const right of parseLitExpr(string)) {
    const op = right.string[right.string.length - 1]
    if (op === '*' || op === '/') {
      for (const left of parseMulExpr(right.string.slice(0, -1))) {
        yield { ...left, expr: { op, a: left.expr, b: right.expr } }
      }
    }
  }
  yield * parseLitExpr(string)
}
function * parseAddExpr (string: string): ParseResult {
  for (const right of parseMulExpr(string)) {
    const op = right.string[right.string.length - 1]
    if (op === '+' || op === '-') {
      for (const left of parseAddExpr(right.string.slice(0, -1))) {
        yield { ...left, expr: { op, a: left.expr, b: right.expr } }
      }
    }
  }
  yield * parseMulExpr(string)
}
export function parse (expression: string): Expression | null {
  for (const result of parseAddExpr(expression.replace(/\s/g, ''))) {
    if (result.string === '') {
      return result.expr
    }
  }
  return null
}

Deno.test({
  name: 'expression_parser',
  fn () {
    assertEquals(parse('3 + 2'), {
      op: '+',
      a: { value: 3 },
      b: { value: 2 }
    })
    assertEquals(parse('3 + 2 + 1'), {
      op: '+',
      a: {
        op: '+',
        a: { value: 3 },
        b: { value: 2 }
      },
      b: { value: 1 }
    })
    assertEquals(parse('3 * (4 - 5) + 2'), {
      op: '+',
      a: {
        op: '*',
        a: { value: 3 },
        b: {
          op: '-',
          a: { value: 4 },
          b: { value: 5 }
        }
      },
      b: { value: 2 }
    })
  }
})
