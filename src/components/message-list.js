import React, { useState, useRef, useEffect } from 'react'

import Api from '../api'

const MessageList = () => {
  const apiRef = useRef()
  const [messages, setMessages] = useState([])

  const isApiStarted = apiRef.current && apiRef.current.isStarted()
  const handleClick = () => {
    isApiStarted ? apiRef.current.stop() : apiRef.current.start()
  }

  useEffect(() => {
    apiRef.current = new Api({
      messageCallback(message) {
        setMessages(prevMessages => [...prevMessages, message])
      },
    })

    apiRef.current.start()
  }, [])

  return (
    <div>
      <button onClick={handleClick}>
        {isApiStarted ? 'Stop Messages' : 'Start Messages'}
      </button>
    </div>
  )
}

export default MessageList
