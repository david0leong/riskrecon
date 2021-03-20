import React, { useState, useCallback, useRef, useEffect } from 'react'

import Api from '../../api'
import './style.scss'

const MESSAGE_TYPES = ['error', 'warning', 'info']

const MessageList = () => {
  const apiRef = useRef()
  const [messages, setMessages] = useState([])
  const handleReset = useCallback(() => {
    setMessages([])
  }, [])

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
    <div className="message-list">
      <div className="message-list__header">
        <button type="button" className="btn btn-success" onClick={handleClick}>
          {isApiStarted ? 'Stop' : 'Start'}
        </button>

        <button type="button" className="btn btn-danger" onClick={handleReset}>
          Clear
        </button>
      </div>

      <div className="message-list__body">
        {MESSAGE_TYPES.map(messageType => (
          <div className="body__header">
            <h4 className="header__title">{messageType}</h4>
            <p className="header__info">Count 2</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MessageList
