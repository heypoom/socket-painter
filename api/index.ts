import {createServer} from 'http'
import {Server} from 'socket.io'
import {range} from 'lodash'

const server = createServer()
server.listen(1337)
server.on('listening', () => console.log('Server started! 🤯'))

const io = new Server(server)

let position: [number, number] = [0, 0]
let colorGrids = range(1, 10).map(() => range(1, 10).map(() => ''))

const buildFlatColorGrid = (grids: string[][]) =>
  range(0, 100).map((i) => {
    const x = i % 10
    const y = 9 - Math.floor(i / 10)

    return grids?.[y]?.[x] ?? ''
  })

io.on('connection', (socket) => {
  console.log('Connected! 😀')

  socket.emit('player:position:changed', position)
  socket.emit('board:color:sync', buildFlatColorGrid(colorGrids))

  const onMove = (x: number, y: number) => () => {
    if (x < 0 || y < 0) return
    if (x > 9 || y > 9) return

    position = [x, y]

    io.emit('player:position:changed', [x, y])

    console.log('Current:', [x, y])
  }

  socket.on('player:move', (movement: 'up' | 'down' | 'right' | 'left') => {
    const [x, y] = position

    console.log('Player moved:', movement)

    const handlers: Record<typeof movement, () => void> = {
      up: onMove(x, y + 1),
      down: onMove(x, y - 1),
      left: onMove(x - 1, y),
      right: onMove(x + 1, y),
    }

    const handle = handlers[movement]
    if (handle) handle()
  })

  socket.on('player:colorize', (color: string) => {
    const [x, y] = position

    console.log('Color changed:', [x, y], color)

    if (colorGrids?.[y]) colorGrids[y][x] = color

    io.emit('board:color:changed', [x, y, color])
  })

  socket.on('disconnect', () => {
    console.log('Disconnected. 😢')
  })
})
