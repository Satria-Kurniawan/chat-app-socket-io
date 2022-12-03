import { useState } from "react"
import io from "socket.io-client"
import Chat from "./Chat"
import { IoEnter } from "react-icons/io5"

const socket = io.connect(process.env.REACT_APP_SERVER_HOST)

function App() {
  const [username, setUsername] = useState("")
  const [roomID, setRoomID] = useState("")
  const [isJoin, setIsJoin] = useState(false)

  const joinRoom = () => {
    if (!username || !roomID) return

    socket.emit("join_room", roomID)
    setIsJoin(true)
  }

  if (isJoin) {
    return (
      <div className="h-screen flex justify-center">
        <Chat
          socket={socket}
          username={username}
          roomID={roomID}
          onLeftChat={() => setIsJoin(false)}
        />
      </div>
    )
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="w-full max-w-[25rem] md:px-0 px-5">
        <div className="text-center text-2xl font-bold mb-10">
          Sensitive <span className="text-blue-500">Chat</span>
          <p className="text-sm font-normal text-gray-400">
            Created by. Satria
          </p>
        </div>
        <div>
          <div className="mb-2">
            <label>Username</label>
            <br />
            <input
              type="text"
              placeholder="Enter username..."
              className="w-full rounded-md py-1.5 px-3 border focus:outline-blue-500"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Room ID</label>
            <br />
            <input
              type="text"
              placeholder="Enter room id..."
              className="w-full rounded-md py-1.5 px-3 border focus:outline-blue-500"
              onChange={(e) => setRoomID(e.target.value)}
            />
          </div>
          <br />
          <button
            onClick={joinRoom}
            className="w-full rounded-md py-1.5 px-3 flex justify-center items-center gap-x-3 bg-black text-white font-semibold hover:bg-blue-500 duration-300 group"
          >
            Join
            <IoEnter
              size={20}
              className="group-hover:rotate-[360deg] duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
