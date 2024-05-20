const form = document.getElementById('form')
const output = document.getElementById('output')

form.addEventListener('submit', () => {
  const data = new FormData(form)
  fetch('/', { method: 'POST', body: data.get('name') })
    .then(r => r.text())
    .then(note => {
      output.textContent = note
    })
})
