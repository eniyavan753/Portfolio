import {useEffect, useState, useRef} from "react"

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{x: 10, y: 10}]
const INITIAL_DIRECTION = {x: 0, y: -1}

export default function SnakeGame({onExit}) {
  const [snake, setSnake] = useState(INITIAL_SNAKE)
  const [direction, setDirection] = useState(INITIAL_DIRECTION)
  const [food, setFood] = useState({x: 5, y: 5})
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const intervalRef = useRef(null)

  // Keyboard controls
  useEffect(() => {
    const handleKey = e => {
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({x: 0, y: -1})
          break
        case "ArrowDown":
          if (direction.y !== -1) setDirection({x: 0, y: 1})
          break
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({x: -1, y: 0})
          break
        case "ArrowRight":
          if (direction.x !== -1) setDirection({x: 1, y: 0})
          break
        case "Escape":
          onExit()
          break
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [direction, onExit])

  // Game loop
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        }

        // Collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= BOARD_SIZE ||
          newHead.y < 0 ||
          newHead.y >= BOARD_SIZE
        ) {
          setGameOver(true)
          clearInterval(intervalRef.current)
          return prev
        }

        // Collision with itself
        if (
          prev.some(
            segment => segment.x === newHead.x && segment.y === newHead.y
          )
        ) {
          setGameOver(true)
          clearInterval(intervalRef.current)
          return prev
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y
        if (ateFood) {
          setScore(s => s + 1) // increment score
          generateFood(prev.concat([newHead]))
          return [newHead, ...prev] // grow snake
        }

        return [newHead, ...prev.slice(0, -1)]
      })
    }, 150)

    return () => clearInterval(intervalRef.current)
  }, [direction, food])

  const generateFood = snakePositions => {
    let newFood
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      }
    } while (
      snakePositions.some(seg => seg.x === newFood.x && seg.y === newFood.y)
    )
    setFood(newFood)
  }

  // Render the board
  const renderBoard = () => {
    let grid = []
    for (let y = 0; y < BOARD_SIZE; y++) {
      let row = ""
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (snake.some(seg => seg.x === x && seg.y === y)) row += "🟩"
        else if (food.x === x && food.y === y) row += "🍎"
        else row += "⬛"
      }
      grid.push(row)
    }
    return grid
  }

  return (
    <div className="bg-black text-green-400 h-screen flex flex-col items-center justify-center font-mono text-xl">
      <div className="mb-2">Score: {score}</div>
      {gameOver ? (
        <div>💀 Game Over! Press ESC to exit</div>
      ) : (
        <pre>{renderBoard().join("\n")}</pre>
      )}
    </div>
  )
}
