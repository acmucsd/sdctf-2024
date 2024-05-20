const name = Deno.args[0] ?? 'file'

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const writer = Deno.stdout.writable.getWriter()
writer.write(encoder.encode(`int ${name}[] = {`))
let first = true
let length = 0

for await (const chunk of Deno.stdin.readable) {
  if (first) {
    first = false
  } else {
    writer.write(encoder.encode(', '))
  }
  const text = decoder.decode(chunk)
  const codeValues = Array.from(text, c => c.codePointAt(0) ?? 0)
  length += codeValues.length
  writer.write(encoder.encode(codeValues.join(', ')))
}
writer.write(encoder.encode(`};\nint ${name}_len = ${length};\n`))
writer.releaseLock()
