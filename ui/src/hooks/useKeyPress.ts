import { useState, useEffect } from 'react'

export function useKeyPress(targetKey: string, callback: () => void) {
  const [keyPressed, setKeyPressed] = useState(false)

  function onKeydown({ key }: KeyboardEvent) {
    console.log(key)

    if (key === targetKey) setKeyPressed(true)
  }

  const onKeyup = ({ key }: KeyboardEvent) => {
    if (key === targetKey) setKeyPressed(false)
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)

    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('keyup', onKeyup)
    }
  }, [])

  useEffect(() => {
    if (keyPressed) callback()
  }, [keyPressed])

  return keyPressed
}
