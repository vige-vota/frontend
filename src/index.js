import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './templates/little-nogroup.css'
import './templates/little.css'
import './templates/bigger.css'
import './templates/bigger-partygroup.css'
import {IntlProvider, addLocaleData} from 'react-intl'
import * as serviceWorker from './serviceWorker'
import locale_en from 'react-intl/locale-data/en'
import locale_it from 'react-intl/locale-data/it'
import messages_it from './translations/it.json'

addLocaleData([...locale_en, ...locale_it])

const messages = {
    'it': messages_it
}
const language = navigator.language.split(/[-_]/)[0]  // language without region code

let config = require('./mock/config-app.json')
ReactDOM.render(<IntlProvider locale={language} messages={messages[language]}><App config={config} /></IntlProvider>, document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
