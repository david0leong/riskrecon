import React from 'react'
import ReactDOM from 'react-dom'

import MessageList from './components/MessageList'
import './styles/main.scss'

const NewApp = require('./components/MessageList').default

function renderApp(App) {
  ReactDOM.render(<App />, document.getElementById('root'))
}

renderApp(MessageList)

if (module.hot) {
  module.hot.accept('./components/MessageList', () => {
    renderApp(NewApp)
  })
}
