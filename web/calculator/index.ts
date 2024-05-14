import { serveDir, serveFile } from 'jsr:@std/http/file-server'
import { parse } from './expression_parser.ts'

const decoder = new TextDecoder()
const resultTemplate = await Deno.readTextFile('./result.html')

Deno.serve({ port: 8080 }, async (req: Request) => {
  try {
    const pathname = new URL(req.url).pathname

    if (pathname === '/' && req.method === 'GET') {
      return serveFile(req, './static/index.html')
    }

    if (pathname === '/' && req.method === 'POST') {
      const body = await req.formData()
      const expression = body.get('expression')
      if (typeof expression !== 'string') {
        return new Response('400 expression should be string', {
          status: 400
        })
      }

      const parsed = parse(expression)
      if (!parsed) {
        new Response(
          resultTemplate
            .replace('{success}', 'failure')
            .replace('{result}', 'syntax error'),
          {
            headers: {
              'Content-Type': 'text/html'
            }
          }
        )
      }

      let success = false
      let output = ''

      const result = await new Deno.Command('python3.11', {
        args: ['calculate.py', JSON.stringify(parsed)]
      }).output()
      const error = decoder.decode(result.stderr).trim()
      const json = decoder.decode(result.stdout).trim()
      if (error.length > 0) {
        output = error
      } else if (json.startsWith('{') && json.endsWith('}')) {
        try {
          output = JSON.parse(json).result
          success = true
        } catch (error) {
          output = `wtf!!1! this shouldnt ever happen\n\n${
            error.stack
          }\n\nheres the flag as compensation: ${
            Deno.env.get('GZCTF_FLAG') ?? 'sdctf{...}'
          }`
        }
      } else {
        output = 'python borked'
      }

      return new Response(
        resultTemplate
          .replace('{success}', success ? 'successful' : 'failure')
          .replace('{result}', () => output),
        {
          headers: {
            'Content-Type': 'text/html'
          }
        }
      )
    }

    if (pathname.startsWith('/static/') && req.method === 'GET') {
      return serveDir(req, {
        fsRoot: 'static',
        urlRoot: 'static'
      })
    }

    return new Response('404 :(', {
      status: 404
    })
  } catch (error) {
    return new Response('500 embarassment\n\n' + error.stack, {
      status: 500
    })
  }
})
