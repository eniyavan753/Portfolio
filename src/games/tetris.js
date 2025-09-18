import {useState, useEffect, useRef} from "react"

const ROWS = 20
const COLS = 10
const EMPTY = "⬛"
const BLOCK = "🟩"

const TETROMINOS = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
  ],
}

function randomTetromino() {
  const keys = Object.keys(TETROMINOS)
  const type = keys[Math.floor(Math.random() * keys.length)]
  return {shape: TETROMINOS[type], type}
}

function createEmptyBoard() {
  return Array.from({length: ROWS}, () => Array(COLS).fill(EMPTY))
}

export default function TetrisGame({onExit}) {
  const [board, setBoard] = useState(createEmptyBoard())
  const [tetromino, setTetromino] = useState({...randomTetromino(), x: 3, y: 0})
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const mergeTetromino = (tempBoard, t) => {
    const newBoard = tempBoard.map(row => row.slice())
    t.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = t.y + dy
          const x = t.x + dx
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) newBoard[y][x] = BLOCK
        }
      })
    })
    return newBoard
  }

  const isValidMove = (t, nx, ny, shape = t.shape) => {
    return shape.every((row, dy) =>
      row.every((cell, dx) => {
        if (!cell) return true
        const x = nx + dx
        const y = ny + dy
        return (
          x >= 0 && x < COLS && y < ROWS && (y < 0 || board[y][x] === EMPTY)
        )
      })
    )
  }

  const rotate = matrix => {
    return matrix[0]
      .map((_, i) => matrix.map(row => row[i]))
      .map(row => row.reverse())
  }

  const clearLines = b => {
    let cleared = 0
    const newBoard = b.filter(row => {
      if (row.every(cell => cell === BLOCK)) {
        cleared++
        return false
      }
      return true
    })
    while (newBoard.length < ROWS) newBoard.unshift(Array(COLS).fill(EMPTY))
    if (cleared > 0) setScore(prev => prev + cleared * 100)
    return newBoard
  }

  const dropTetromino = () => {
    if (!isValidMove(tetromino, tetromino.x, tetromino.y + 1)) {
      // Merge tetromino
      const newBoard = mergeTetromino(board, tetromino)
      setBoard(clearLines(newBoard))
      const next = {...randomTetromino(), x: 3, y: 0}
      if (!isValidMove(next, next.x, next.y)) {
        setGameOver(true)
      } else {
        setTetromino(next)
      }
    } else {
      setTetromino(prev => ({...prev, y: prev.y + 1}))
    }
  }

  const move = dx => {
    if (isValidMove(tetromino, tetromino.x + dx, tetromino.y)) {
      setTetromino(prev => ({...prev, x: prev.x + dx}))
    }
  }

  const rotateTetromino = () => {
    const newShape = rotate(tetromino.shape)
    if (isValidMove(tetromino, tetromino.x, tetromino.y, newShape)) {
      setTetromino(prev => ({...prev, shape: newShape}))
    }
  }

  useEffect(() => {
    const interval = setInterval(dropTetromino, 500)
    return () => clearInterval(interval)
  })

  useEffect(() => {
    const handleKey = e => {
      if (gameOver) {
        if (e.key === "Escape") onExit()
        return
      }
      switch (e.key) {
        case "ArrowLeft":
          move(-1)
          break
        case "ArrowRight":
          move(1)
          break
        case "ArrowDown":
          dropTetromino()
          break
        case "ArrowUp":
          rotateTetromino()
          break
        case "Escape":
          onExit()
          break
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [tetromino, board, gameOver])

  const renderBoard = () => {
    const tempBoard = board.map(row => row.slice())
    tetromino.shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const y = tetromino.y + dy
          const x = tetromino.x + dx
          if (y >= 0 && y < ROWS && x >= 0 && x < COLS) tempBoard[y][x] = BLOCK
        }
      })
    })
    return tempBoard.map(row => row.join(" ")).join("\n")
  }

  return (
    <div className="bg-black text-green-400 h-screen flex flex-col items-center justify-center font-mono p-2">
      {gameOver && (
        <div className="mb-2 text-red-500">💀 Game Over! Press ESC to exit</div>
      )}
      {!gameOver && <div className="mb-2 text-green-400">Score: {score}</div>}
      <pre>{renderBoard()}</pre>
      <div className="mt-2 text-green-400">
        Use Arrow keys: Left/Right to move, Up to rotate, Down to drop, ESC to
        exit
      </div>
    </div>
  )
}
