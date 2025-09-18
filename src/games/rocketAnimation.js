import {useEffect, useState} from "react"

export default function RocketAnimation({onExit}) {
  const [frame, setFrame] = useState(0)
  const rocketFrames = [
    "   🚀   \n   |   \n  / \\ \n",
    "   🚀   \n   |   \n /   \\ \n",
    "   🚀   \n   |   \n/     \\ \n",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % rocketFrames.length)
    }, 200)

    const handleKey = e => {
      if (e.key === "Escape") onExit()
    }
    window.addEventListener("keydown", handleKey)

    return () => {
      clearInterval(interval)
      window.removeEventListener("keydown", handleKey)
    }
  }, [onExit])

  return (
    <pre className="bg-black text-green-400 h-screen flex items-center justify-center font-mono text-xl">
      {rocketFrames[frame]}
      <br />
      Press ESC to exit
    </pre>
  )
}
