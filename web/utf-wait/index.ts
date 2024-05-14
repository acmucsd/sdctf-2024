import { TextEncoder } from './polyfill.ts'
import { HTML } from './static_files.ts'

const encoder = new TextEncoder()
const flag = Deno.env.get('FLAG') ?? 'sdctf{this_is_not_the_flag}'

const hashBuffer = (buuffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buuffer), char =>
    char.toString(16).padStart(2, '0')
  ).join('')

const notes = new Map<string, ArrayBuffer>()
notes.set(hashBuffer(encoder.encode('flag')), encoder.encode(flag))

const html = encoder.encode(HTML)
const error404 = encoder.encode('404: not found')
const error405 = encoder.encode('405: method not allowed')

Deno.serve(async req => {
  const url = new URL(req.url)
  if (req.method === 'GET') {
    if (url.pathname === '/') {
      return new Response(html.buffer, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    } else {
      return new Response(error404.buffer, {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
      })
    }
  } else if (req.method === 'POST') {
    const buffer = await req.arrayBuffer()
    const note = notes.get(hashBuffer(buffer))
    if (note) {
      return new Response(note, {
        headers: { 'Content-Type': 'text/html; charset=UTF-8' }
      })
    } else {
      return new Response(error404.buffer, {
        status: 404,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
      })
    }
  }
  return new Response(error405.buffer, {
    status: 405,
    headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
  })
})
