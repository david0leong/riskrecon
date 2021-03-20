import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import groupBy from 'lodash.groupby'

import Api from '../../api'
import './style.scss'

const MESSAGE_TYPES = {
  1: 'Error',
  2: 'Warning',
  3: 'Info',
}

const MessageList = () => {
  const apiRef = useRef()
  const [messages, setMessages] = useState([])
  const groupedMessages = useMemo(
    () => groupBy([].concat(messages).reverse(), 'priority'), // Reverse order and group by priority
    [messages]
  )
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
        {Object.keys(MESSAGE_TYPES).map(key => {
          const messageType = MESSAGE_TYPES[key]
          const messageCount = (groupedMessages[key] || []).length

          return (
            <div className="body__header" key={key}>
              <h4 className="header__title">{messageType}</h4>
              <p className="header__info">Count: {messageCount}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MessageList
