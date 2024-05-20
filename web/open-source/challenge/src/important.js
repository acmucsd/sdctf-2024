import { teapot, apple, bana, banana, seed, dirby, c, torch, obj } from './huh'

console.log('Flag checker time!')
what.addEventListener('submit', () => {
  console.log('Checking flag...!')
  alert(
    new FormData(what).get(teapot() + apple() + bana() + banana()) ===
      [seed, dirby, c, torch, teapot, () => `{${Object.keys(obj).join('_')}}`]
        .map(a => a())
        .join('')
      ? 'true!! this is the real flag'
      : 'false'
  )
})
