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
  const profile = {
  about: [
    "I'm Eniyavan K",
    "⚡ A B.Tech IT graduate and Backend Developer with 3+ years of experience.",
    "💻 Specializing in Node.js, TypeScript, LoopBack 4, and PostgreSQL.",
    "🌐 Experienced in building scalable backend systems, microservices, REST APIs, and IoT solutions.",
    "🔧 Hands-on experience with RabbitMQ, Redis, MQTT, WebSockets, and Docker.",
    "📡 Experienced in real-time communication, IoT device integration, and firmware-level interactions.",
    "🚀 Passionate about designing reliable, high-performance systems and solving complex engineering problems.",
    "🎯 Focused on clean architecture, performance optimization, and delivering maintainable software.",
    "🤝 Let's connect and build something meaningful!"
  ],

  projects: [
    "📌 Astromon – Real-time Health Monitoring Application",
    "📌 IoT Irrigation Automation – Node.js, LoopBack 4, MQTT, RabbitMQ",
    "📌 Real-time IoT Data Platform – Node.js, Prisma, PostgreSQL, InfluxDB",
    "📌 Portfolio – Personal Developer Portfolio"
  ],

  experience: [
    "🏢 Mobitech Wireless Solution Private Limited — Jr. Backend Developer",
    "🗓 Jan 2025 - Present · On-site · Full-time",
    "• Developing and maintaining scalable backend microservices using Node.js, TypeScript, and LoopBack 4",
    "• Implementing IoT-based irrigation automation with time, cycle, and sensor-based operating modes",
    "• Managing device communication through MQTT, including command publishing and response processing",
    "• Building reliable asynchronous workflows using RabbitMQ, message acknowledgements, and retry mechanisms",
    "• Designing PostgreSQL queries, stored procedures, and database operations",
    "• Implementing Redis caching to optimize data access and application performance",
    "• Integrating Firebase Cloud Messaging and WebSockets for notifications and real-time updates",
    "• Working with Docker, SonarQube, OpenTelemetry, and Grafana for deployment, code quality, and monitoring",
    "• Troubleshooting production issues and delivering backend features",

    " ",
    "🏢 Astromeda Space Pvt Ltd — Software Developer",
    "🗓 Jul 2023 - Jan 2025 · On-site · Bengaluru, Karnataka, India",
    "• Developed React Native applications for real-time data visualization",
    "• Built backend services and REST APIs using Node.js, Prisma, and Node-RED",
    "• Designed and optimized PostgreSQL and InfluxDB database schemas",
    "• Integrated BLE and MQTT for real-time IoT device communication",
    "• Implemented WebSockets and Server-Sent Events for live data streaming",
    "• Integrated Dialogflow with Node.js services for database-driven interactions",
    "• Dockerized applications and supported CI/CD workflows",
    "• Implemented authentication and authorization using Auth0, RBAC, and JWT"
  ],

  skills: [
    "Node.js",
    "TypeScript",
    "LoopBack 4",
    "PostgreSQL",
    "Prisma",
    "Microservices",
    "REST APIs",
    "RabbitMQ",
    "Redis",
    "MQTT",
    "WebSockets",
    "Docker",
    "React.js",
    "React Native",
    "InfluxDB",
    "Git",
    "OpenTelemetry",
    "Grafana"
  ],

  contact: [
    "📧 eniyavan.1906011@srit.org",
    "🔗 LinkedIn: https://www.linkedin.com/in/eniyavan-kumar-a44351196/",
    "💻 GitHub: https://github.com/eniyavan753"
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
