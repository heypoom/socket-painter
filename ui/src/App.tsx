import React, { useEffect, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import c from 'classnames'

import IO, { Socket, SocketOptions } from 'socket.io-client'
import { ManagerOptions } from 'socket.io-client/build/manager'

import _ from 'lodash'

import { useKeyPress } from './hooks/useKeyPress'

import './App.css'

interface IProps {}

const io = (IO as unknown) as (
  uri: string,
  opts?: Partial<ManagerOptions | SocketOptions>,
) => Socket

const s = io('http://localhost:1337', { transports: ['websocket'] })

const palette = ['#111', 'red', 'hotpink', 'pink']

const updateByIndex = <T,>(i: number, target: T, list: T[]) =>
  list.map((item, idx) => (idx === i ? target : item))

const toXY = (i: number): [number, number] => [i % 10, 9 - Math.floor(i / 10)]
const toI = (x: number, y: number) => (9 - y) * 10 + x

function App({}: IProps) {
  const [pos, setPos] = useState<[number, number]>([0, 0])
  const [color, setColor] = useState('')

  const [colorList, setColorList] = useState(_.range(1, 100).map(() => ''))

  const move = (dir: string) => () => {
    s.emit('player:move', dir)
  }

  const colorize = (color: string) => () => {
    setColor(color)
    s.emit('player:colorize', color)
  }

  useKeyPress('ArrowUp', move('up'))
  useKeyPress('ArrowDown', move('down'))
  useKeyPress('ArrowLeft', move('left'))
  useKeyPress('ArrowRight', move('right'))

  useKeyPress('0', colorize(palette[0]))
  useKeyPress('1', colorize(palette[1]))
  useKeyPress('2', colorize(palette[2]))
  useKeyPress('3', colorize(palette[3]))

  const onColorChanged = ([x, y, color]: [number, number, string]) =>
    setColorList((g) => updateByIndex(toI(x, y), color, g))

  useEffect(() => {
    s.on('player:position:changed', setPos)
    s.on('board:color:changed', onColorChanged)
    s.on('board:color:sync', setColorList)

    // s.on('player:color:changed', setColor)

    return () => {
      s.off('player:position:changed')
      s.off('board:color:changed')
      s.off('board:color:sync')
    }
  }, [])

  return (
    <div className="App">
      <div className="App-header">
        <div className="mb-4">
          I am at ({pos.join(', ')}) - {toI(...pos)}
        </div>

        <div className="grid grid-rows-10 grid-cols-10">
          {_.range(0, 100).map((i) => {
            const [gx, gy] = toXY(i)
            const [px, py] = pos

            const cur = gx === px && gy === py

            const style = {
              ...(colorList[i] && { background: colorList[i], color: 'white' }),
            }

            return (
              <div
                className={c(
                  'px-2 py-3 border-2 border-transparent',
                  cur && 'border-white',
                )}
                style={style}
                key={i}
              >
                <div className="text-xs">
                  ({gx}, {gy})
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex my-10">
          {palette.map((bg) => (
            <div
              onClick={colorize(bg)}
              className="w-10 h-10 rounded-full ml-6 cursor-pointer"
              style={{
                background: bg,
                border: color === bg ? '3px solid white' : '',
              }}
              key={bg}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
