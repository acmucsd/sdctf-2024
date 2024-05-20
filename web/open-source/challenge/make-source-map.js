import { encode } from 'vlq'
import { readFile, writeFile } from 'fs/promises'

const lines = (await readFile('./static/index.js', 'utf-8')).split(/\r?\n/)

const code = `const form = document.getElementById('form')
form.onsubmit = () => {
  console.log('Checking flag...!')
  alert(
    document.querySelector('[name=flag]').value === 'ctf{this_is_not_the_flag}'
      ? 'true!! this is the FAKE flag'
      : 'false'
  )
}

console.log('Flag checker time!')

//
console.log(require('moment').__LIB_ID)
`

writeFile(
  './static/index.js.map',
  JSON.stringify({
    version: 3,
    sources: ['index.js'],
    sourcesContent: [code],
    mappings: lines
      .map(line =>
        line.includes('this is the real flag') ? encode([0, 0, 0, 0, 0]) : ''
      )
      .join(';'),
    names: ['form']
  })
)
