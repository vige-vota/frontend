import React from 'react'

import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App'
import './templates/little-nogroup.css'
import './templates/little.css'
import './templates/bigger.css'
import './templates/bigger-partygroup.css'
import './templates/referendum.css'
import {IntlProvider} from 'react-intl'
import * as serviceWorker from './serviceWorker'
import messages_it from './translations/it.json'
import UserService from './services/UserService'

const messages = {
    'it': messages_it
}
const language = navigator.language.split(/[-_]/)[0]  // language without region code

const root = createRoot(document.getElementById('root'));
const renderApp = () => root.render(<IntlProvider locale={language} messages={messages[language]}><App /></IntlProvider>)
UserService.initKeycloak(renderApp)
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()