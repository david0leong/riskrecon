import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import groupBy from 'lodash.groupby'

import Api from '../../api'
import './style.scss'

const MESSAGE_PRIORITIES = {
  1: 'error',
  2: 'warning',
  3: 'info',
}

const MessageList = () => {
  const apiRef = useRef()
  const [isApiStarted, setIsApiStarted] = useState(false)
  const [messages, setMessages] = useState([])
  const groupedMessages = useMemo(
    () => groupBy([].concat(messages).reverse(), 'priority'), // Reverse order and group by priority
    [messages]
  )
  const toggleApiStart = useCallback(() => {
    isApiStarted ? apiRef.current.stop() : apiRef.current.start()

    setIsApiStarted(!isApiStarted)
  }, [isApiStarted, setIsApiStarted])

  const handleReset = useCallback(() => {
    setMessages([])
  }, [])

  const handleDelete = useCallback(
    messageToDelete => {
      setMessages(messages.filter(message => message.id !== messageToDelete.id))
    },
    [messages, setMessages]
  )

  useEffect(() => {
    // Initialize api when mounted
    apiRef.current = new Api({
      messageCallback(message) {
        setMessages(prevMessages => [...prevMessages, message])
      },
    })

    toggleApiStart()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="message-list">
      <div className="message-list__header">
        <button
          type="button"
          className="btn btn-success text-uppercase"
          onClick={toggleApiStart}
        >
          {isApiStarted ? 'Stop' : 'Start'}
        </button>

        <button
          type="button"
          className="btn btn-danger text-uppercase"
          onClick={handleReset}
        >
          Clear
        </button>
      </div>

      <div className="message-list__body">
        {Object.keys(MESSAGE_PRIORITIES).map(key => {
          const priority = MESSAGE_PRIORITIES[key]
          const messages = groupedMessages[key] || []
          const count = messages.length

          return (
            <div key={key} className="message-list__column">
              <div key={key} className="column__header">
                <h4 className="header__title">{priority}</h4>
                <p className="header__info">Count: {count}</p>
              </div>

              {messages.map(message => (
                <div key={message.id} className={`column__card ${priority}`}>
                  <p className="card__message">{message.message}</p>

                  <button
                    type="button"
                    className="btn btn-link btn-sm text-dark"
                    onClick={() => handleDelete(message)}
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MessageList
