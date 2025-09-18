import {useState, useEffect} from "react"

const BOARD_SIZE = 8 // 8x8 grid
const MINES_COUNT = 10

function generateBoard() {
  const board = Array(BOARD_SIZE)
    .fill(0)
    .map(() =>
      Array(BOARD_SIZE).fill({value: 0, revealed: false, flagged: false})
    )

  // Place mines randomly
  let minesPlaced = 0
  while (minesPlaced < MINES_COUNT) {
    const x = Math.floor(Math.random() * BOARD_SIZE)
    const y = Math.floor(Math.random() * BOARD_SIZE)
    if (board[y][x].value === "💣") continue
    board[y][x] = {...board[y][x], value: "💣"}
    minesPlaced++
  }

  // Calculate numbers
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (board[y][x].value === "💣") continue
      let count = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy
          const nx = x + dx
          if (ny >= 0 && ny < BOARD_SIZE && nx >= 0 && nx < BOARD_SIZE) {
            if (board[ny][nx].value === "💣") count++
          }
        }
      }
      board[y][x] = {...board[y][x], value: count}
    }
  }

  return board
}

export default function MinesweeperGame({onExit}) {
  const [board, setBoard] = useState(generateBoard())
  const [cursor, setCursor] = useState({x: 0, y: 0})
  const [gameOver, setGameOver] = useState(false)
  const [victory, setVictory] = useState(false)

  // Keyboard controls
  useEffect(() => {
    const handleKey = e => {
      if (gameOver || victory) {
        if (e.key === "Escape") onExit()
        return
      }

      let {x, y} = cursor

      switch (e.key) {
        case "ArrowUp":
          y = y > 0 ? y - 1 : y
          break
        case "ArrowDown":
          y = y < BOARD_SIZE - 1 ? y + 1 : y
          break
        case "ArrowLeft":
          x = x > 0 ? x - 1 : x
          break
        case "ArrowRight":
          x = x < BOARD_SIZE - 1 ? x + 1 : x
          break
        case " ":
        case "Enter":
          revealCell(x, y)
          break
        case "f":
        case "F":
          toggleFlag(x, y)
          break
        case "Escape":
          onExit()
          break
      }
      setCursor({x, y})
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [cursor, board, gameOver, victory])

  const revealCell = (x, y) => {
    const newBoard = board.map(row => row.map(cell => ({...cell})))
    const cell = newBoard[y][x]

    if (cell.revealed || cell.flagged) return

    if (cell.value === "💣") {
      cell.revealed = true
      setBoard(newBoard)
      setGameOver(true)
      return
    }

    const floodFill = (fx, fy) => {
      const c = newBoard[fy][fx]
      if (c.revealed || c.flagged) return
      c.revealed = true
      if (c.value === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = fx + dx
            const ny = fy + dy
            if (nx >= 0 && nx < BOARD_SIZE && ny >= 0 && ny < BOARD_SIZE)
              floodFill(nx, ny)
          }
        }
      }
    }

    floodFill(x, y)
    setBoard(newBoard)

    // Check victory
    const unrevealed = newBoard
      .flat()
      .filter(c => !c.revealed && c.value !== "💣")
    if (unrevealed.length === 0) setVictory(true)
  }

  const toggleFlag = (x, y) => {
    const newBoard = board.map(row => row.map(cell => ({...cell})))
    const cell = newBoard[y][x]
    if (!cell.revealed) cell.flagged = !cell.flagged
    setBoard(newBoard)
  }

  const renderBoard = () => {
    return board.map((row, y) => {
      return row
        .map((cell, x) => {
          let display = "⬜"
          if (cell.flagged) display = "🚩"
          else if (cell.revealed) display = cell.value === 0 ? "⬛" : cell.value
          if (cursor.x === x && cursor.y === y) display = `[${display}]`
          return display
        })
        .join(" ")
    })
  }

  return (
    <div className="bg-black text-green-400 h-screen flex flex-col items-center justify-center font-mono text-lg p-2">
      {gameOver && (
        <div className="mb-2 text-red-500">💥 Game Over! Press ESC to exit</div>
      )}
      {victory && (
        <div className="mb-2 text-yellow-400">
          🏆 You Won! Press ESC to exit
        </div>
      )}
      {!gameOver && !victory && (
        <div className="mb-2 text-green-400">
          Use Arrow keys to move, Enter/Space to reveal, F to flag
        </div>
      )}
      <pre>{renderBoard().join("\n")}</pre>
    </div>
  )
}
