import { useEffect, useState } from "react"
import { IoSend } from "react-icons/io5"
import { IoIosArrowRoundBack } from "react-icons/io"
import Scroller from "react-scroll-to-bottom"

function Chat({ socket, username, roomID, onLeftChat }) {
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (!message) return

    const data = {
      roomID,
      username,
      message,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    }

    await socket.emit("send_message", data)
    setMessageList((current) => [...current, data])
    setMessage("")
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((current) => [...current, data])
    })

    return () => {
      socket.off("receive_message")
    }
  }, [socket])

  return (
    <div className="w-full max-w-[25rem] md:px-0 px-5 my-5">
      <header className="w-full rounded-t-md border-t border-x py-1.5 px-3 flex justify-between items-center">
        <IoIosArrowRoundBack
          size={30}
          onClick={onLeftChat}
          className="text-blue-500 cursor-pointer"
        />
        <h1 className="text-center text-2xl font-bold">
          Sensitive <span className="text-blue-500">Chat</span>
        </h1>
        <div className="invisible">
          <IoIosArrowRoundBack size={30} />
        </div>
      </header>
      <main>
        <Scroller className="w-full h-[80vh] rounded-b-md border p-3 mb-3">
          {messageList.map((obj, i) => (
            <div key={i} className="p-3">
              <div
                className={`${
                  obj.username === username ? "mr-auto" : "ml-auto"
                } w-fit max-w-[17rem]`}
              >
                <h1>{obj.username}</h1>
                <div
                  className={`${
                    obj.username === username ? "bg-black" : "bg-blue-500"
                  } rounded-md py-1.5 px-3 text-white`}
                >
                  <p className="break-words">{obj.message}</p>
                </div>
                <h6 className="text-sm text-right">{obj.time}</h6>
              </div>
            </div>
          ))}
        </Scroller>
      </main>
      <div className="w-full flex items-center gap-x-3">
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          className="w-full rounded-md py-1.5 px-3 border focus:outline-blue-500"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="rounded-md p-[0.550rem] bg-black text-white hover:bg-blue-500 group"
        >
          <IoSend
            size={20}
            className="group-hover:rotate-[360deg] duration-300"
          />
        </button>
      </div>
    </div>
  )
}

export default Chat
