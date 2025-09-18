import {useState, useEffect, useRef} from "react"
import Loader from "./loader"
import SnakeGame from "../games/snake"
import TetrisGame from "../games/tetris"
import MinesweeperGame from "../games/minesweeper"
import RocketAnimation from "../games/rocketAnimation"

const commands = {
  help: [
    "Available commands:",
    "about - Who I am",
    "projects - My work",
    "experience - My current & past roles",
    "contact - Get in touch",
    "snake - Play Snake game",
    "minesweeper - Play Minesweeper",
    "rocket - Rocket launch animation",
    "tetris - Play Tetris",
    "clear - Clear the screen",
  ],
  about: [
    "Im Eniyavan K",
    "⚡ A B.Tech IT graduate and IoT software developer with over 2 years of experience.",
    "💻 Specializing in Node.js, TypeScript, React.js, React Native, and Docker.",
    "🌐 I build high-performance web and mobile applications, scalable backend systems,",
    "   and innovative IoT solutions.",
    "🔧 Hands-on experience with IoT devices, sensor data management,",
    "   and real-time applications bridging hardware and software.",
    "🎯 I focus on delivering reliable, efficient, and user-centric solutions.",
    "🚀 Passionate about solving complex problems and driving meaningful impact through technology.",
    "🤝 Let’s connect and explore how I can contribute to your projects!",
  ],
  projects: [
    "📌 Astromon (Health monitoring app)",
    "📌 Portfolio (this site!)",
    "📌 Node.js APIs with Prisma & InfluxDB",
  ],
  experience: [
    "🏢 Mobitech Wireless Solution Private Limited — Jr. Backend Developer",
    "🗓 Jan 2025 - Present (9 months) · On-site · Full-time",
    "• Handling firmware-level communication by sending commands and processing response packets from IoT devices",
    "• Automating irrigation systems with time-based, cycle-based, and sensor-based modes",
    "• Ensuring reliable data flow using RabbitMQ and MQTT",
    "• Writing efficient queries and stored procedures with PostgreSQL",
    "• Using Redis for fast data access and caching",
    "• Implementing push and data notifications with Firebase Cloud Messaging (FCM)",
    "• Fixing bugs, delivering features on time, and managing tasks through Jira",
    "• Maintaining secure, scalable microservices using the MVC architecture with LoopBack,",
    "  ensuring the system stays organized for easy maintenance and growth,",
    "  while using SonarQube to keep code quality in check",
    " ",
    "🏢 Astromeda Space Pvt Ltd — Software Developer",
    "🗓 Jul 2023 - Jan 2025 (1 yr 7 mos) · On-site · Bengaluru, Karnataka, India",
    "• Developed React Native applications for real-time data visualization",
    "• Built scalable backend systems with Node.js, Prisma, and Node-RED for automated data flow",
    "• Designed scalable database schemas for PostgreSQL and InfluxDB",
    "• Worked with BLE and MQTT for real-time communication with IoT devices",
    "• Connected Dialogflow with database via Node.js service for database-driven interactions",
    "• Dockerized applications for better CI/CD",
    "• Implemented WebSockets and SSE for live data streaming",
    "• Secured authentication with RBAC and JWT",
  ],
  contact: [
    "📧 eniyavan.1906011@srit.org",
    "🔗 LinkedIn: https://linkedin.com/in/your-handle",
    "💻 GitHub: https://github.com/your-handle",
  ],
  snake: ["Launching Snake game..."],
  minesweeper: ["Launching Minesweeper..."],
  rocket: ["Igniting Rocket..."],
  tetris: ["Launching Tetris..."],
}

export default function Terminal() {
  const [loading, setLoading] = useState(true)
  const [lines, setLines] = useState(["Type 'help' to get started"])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeGame, setActiveGame] = useState(null)
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Auto-scroll
  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [lines])

  // Keep input focused
  useEffect(() => {
    inputRef.current?.focus()
  }, [lines, isTyping, activeGame])

  const typeLine = (line, callback) => {
    setIsTyping(true)
    let i = 0
    let typed = ""
    const interval = setInterval(() => {
      typed += line[i]
      if (i === 0) setLines(prev => [...prev, typed])
      else setLines(prev => [...prev.slice(0, -1), typed])
      i++
      if (i === line.length) {
        clearInterval(interval)
        setIsTyping(false)
        callback?.()
      }
    }, 20)
  }

  const handleCommand = cmd => {
    const command = cmd.toLowerCase()
    if (command === "clear") {
      setLines([])
      return
    }

    if (["snake", "tetris", "minesweeper", "rocket"].includes(command)) {
      setActiveGame(command)
      return
    }

    const output = commands[command] || [`Unknown command: ${cmd}`]
    setLines(prev => [...prev, `$ ${cmd}`])

    let idx = 0
    const printNext = () => {
      if (idx < output.length) {
        typeLine(output[idx], printNext)
        idx++
      }
    }
    printNext()
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!input.trim() || isTyping) return
    handleCommand(input.trim())
    setInput("")
  }

  if (loading) return <Loader />

  // Render active game/animation
  if (activeGame === "snake")
    return <SnakeGame onExit={() => setActiveGame(null)} />
  if (activeGame === "tetris")
    return <TetrisGame onExit={() => setActiveGame(null)} />
  if (activeGame === "minesweeper")
    return <MinesweeperGame onExit={() => setActiveGame(null)} />
  if (activeGame === "rocket")
    return <RocketAnimation onExit={() => setActiveGame(null)} />

  return (
    <div className="bg-black text-green-400 font-mono h-screen p-4 flex flex-col">
      <div className="overflow-y-auto flex-1 space-y-1" ref={terminalRef}>
        {lines.map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex mt-2 items-center">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          className="bg-black text-green-400 outline-none flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <span className="blink ml-1">&nbsp;</span>
      </form>
    </div>
  )
}
