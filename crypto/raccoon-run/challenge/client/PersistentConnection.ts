import { ClientMessage, ServerMessage } from './types'

export class PersistentConnection {
  url: string
  ws: WebSocket | null = null
  queue: ClientMessage[] = []
  onMessage: (message: ServerMessage) => void

  constructor (url: string, onMessage: (message: ServerMessage) => void) {
    this.url = url
    this.onMessage = onMessage
    this.connect()
  }

  connect () {
    if (this.ws) {
      return
    }
    // Create a WebSocket connection
    const socket = new WebSocket(this.url)

    // Event listener for WebSocket connection open
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established.')
      // You can send messages here if needed
      for (const message of this.queue) {
        socket.send(JSON.stringify(message))
      }
      this.queue = []
    })

    // Event listener for WebSocket messages
    socket.addEventListener('message', event => {
      console.log('Message from server:', event.data)
      this.onMessage(JSON.parse(event.data))
    })

    // Event listener for WebSocket connection close
    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed.')
      this.ws = null
      setTimeout(() => this.connect(), 1000)
    })

    // Event listener for WebSocket errors
    socket.addEventListener('error', error => {
      console.error('WebSocket encountered an error:', error)
      this.ws = null
    })

    this.ws = socket
  }

  send (message: ClientMessage) {
    if (this.ws) {
      console.log('Sending:', message)
      this.ws.send(JSON.stringify(message))
    } else {
      this.queue.push(message)
    }
  }
}
