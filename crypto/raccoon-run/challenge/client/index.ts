import { PersistentConnection } from './PersistentConnection'
import { loadImage } from './loadImage'
import { FINISH_LINE, GameState, NUM_RACCOONS, TARGET_BET } from './types'

const modal = document.getElementById('modal')
const modalContent = document.getElementById('modal-content')
const canvas = document.getElementById('canvas')
const responses = document.getElementById('responses')
const bet = document.getElementById('bet')
const buyFlagBtn = document.getElementById('buy-flag')
const balance = document.getElementById('balance')
const time = document.getElementById('time')
if (
  !(modal instanceof HTMLDialogElement) ||
  !modalContent ||
  !(canvas instanceof HTMLCanvasElement) ||
  !responses ||
  !(bet instanceof HTMLFormElement) ||
  !(buyFlagBtn instanceof HTMLButtonElement) ||
  !balance ||
  !time
) {
  throw new TypeError('bad types')
}
const c = canvas.getContext('2d')
if (!c) {
  throw new TypeError('no context')
}

let lastState: GameState | null = null
new ResizeObserver(([{ devicePixelContentBoxSize }]) => {
  const [{ inlineSize, blockSize }] = devicePixelContentBoxSize
  canvas.width = inlineSize
  canvas.height = blockSize
  if (lastState) {
    render(lastState)
  }
}).observe(canvas)

const modalQueue: string[] = []
modal.addEventListener('click', function (event) {
  if (event.target === this) {
    this.close()
  }
})
let timeoutId = -1
modal.addEventListener('close', () => {
  clearTimeout(timeoutId)
  timeoutId = setTimeout(() => {
    const next = modalQueue.shift()
    if (next) {
      modalContent.textContent = next
      modal.showModal()
    }
  }, 250)
})
const showModal = (content: string) => {
  if (modal.open) {
    modalQueue.push(content)
  } else {
    modalContent.textContent = content
    modal.showModal()
  }
}

const raccoons = await Promise.all(
  Array.from({ length: 8 }, (_, i) => loadImage(`./raccoons/raccoon${i}.png`))
)

// Extract HOSTname and port from the current page URL
const HOST = window.location.host

// Determine the WebSocket protocol based on the current page URL
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'

let end = 0
let animationId = -1
const setTime = () => {
  const now = Date.now()
  time.textContent = (Math.max(end - now, 0) / 1000).toFixed(3)
  if (now < end) {
    animationId = window.requestAnimationFrame(setTime)
  }
}

// Construct the WebSocket URL using the extracted HOSTname, port, and protocol
const conn = new PersistentConnection(`${protocol}//${HOST}/ws`, message => {
  switch (message.type) {
    case 'race_information': {
      render(message)
      lastState = message
      break
    }
    case 'response': {
      const response = Object.assign(document.createElement('div'), {
        className: 'response',
        textContent: message.value
      })
      const dismissBtn = Object.assign(document.createElement('button'), {
        className: 'dismiss',
        textContent: 'Dismiss'
      })
      dismissBtn.addEventListener('click', () => {
        response.classList.add('dismissed')
        setTimeout(() => response.remove(), 500)
      })
      response.append(dismissBtn)
      responses.append(response)
      break
    }
    case 'flag': {
      showModal(message.value)
      break
    }
    case 'result': {
      showModal(
        `The winners are:\n\n${message.value
          .map((raccoon, i) => `${i + 1}. Raccoon ${raccoon + 1}`)
          .join('\n')}`
      )
      break
    }
    case 'bet_status': {
      showModal(message.value)
      break
    }
    case 'betting-starts': {
      window.cancelAnimationFrame(animationId)
      end = message.until * 1000
      setTime()
      break
    }
  }
})

bet.addEventListener('submit', () => {
  const formData = new FormData(bet)
  const order = formData.get('order')
  const amount = formData.get('amount')
  if (typeof order === 'string' && typeof amount === 'string') {
    conn.send({
      type: 'bet',
      order: order.split('').map(digit => +digit - 1),
      amount: +amount
    })
  }
})

buyFlagBtn.addEventListener('click', () => {
  conn.send({ type: 'buy_flag' })
})

const ROW_HEIGHT = 50
const RACCOON_HEIGHT = 80
const GAP = 10
const SIDE_PADDING = 100
const LINE_WIDTH = 3
const MARGIN_TOP = 80

const render = (state: GameState) => {
  c.save()

  const width = canvas.width / window.devicePixelRatio
  const height = canvas.height / window.devicePixelRatio

  c.font =
    "16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
  c.textBaseline = 'middle'

  // Background
  c.fillStyle = '#111827'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.scale(window.devicePixelRatio, window.devicePixelRatio)

  // Lines
  c.fillStyle = 'white'
  const lineLeight = state.raccoons.length * (ROW_HEIGHT + GAP) - GAP
  c.fillRect(SIDE_PADDING, MARGIN_TOP, LINE_WIDTH, lineLeight)
  c.fillRect(width - SIDE_PADDING, MARGIN_TOP, LINE_WIDTH, lineLeight)

  // Tracks and raccoons
  for (const [i, position] of state.raccoons.entries()) {
    const y = MARGIN_TOP + i * (ROW_HEIGHT + GAP)
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, y, width, ROW_HEIGHT)
    if (position === 0) {
      c.fillStyle = 'rgba(255, 255, 255, 0.5)'
      c.fillText(`Raccoon ${i + 1}`, SIDE_PADDING + 20, y + ROW_HEIGHT / 2)
    }
    const place = state.finishers.indexOf(i)
    if (place !== -1) {
      c.fillStyle = 'rgba(255, 255, 255, 0.5)'
      c.fillText(
        `${place + 1}${['st', 'nd', 'rd'][place] ?? 'th'} Place`,
        width - SIDE_PADDING + 20,
        y + ROW_HEIGHT / 2
      )
    }
    const image = raccoons[i % raccoons.length]
    const imageWidth = (RACCOON_HEIGHT / image.height) * image.width
    c.drawImage(
      image,
      (position / FINISH_LINE) * (width - SIDE_PADDING * 2) +
        SIDE_PADDING -
        imageWidth,
      y + ROW_HEIGHT - RACCOON_HEIGHT,
      imageWidth,
      RACCOON_HEIGHT
    )
  }

  c.restore()

  balance.textContent = String(state.account)
  if (state.can_bet === 'true') {
    bet.classList.remove('cant-bet')
  } else {
    bet.classList.add('cant-bet')
  }
  buyFlagBtn.disabled = state.account < TARGET_BET
}
