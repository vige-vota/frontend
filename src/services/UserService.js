import Keycloak from 'keycloak-js'
import axios from 'axios'

const _kc = new Keycloak({
	clientId: 'frontend',
	realm: 'vota-domain',
	url: process.env.REACT_APP_AUTH_URL
})
const defaultOptions = {
  headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
  },
};
const axiosInstance = axios.create(defaultOptions)

/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */
const initKeycloak = (onAuthenticatedCallback) => {
  _kc.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
  })
    .then((authenticated) => {
      if (authenticated) {
        axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + getToken()
        onAuthenticatedCallback()
      } else {
        console.warn("not authenticated!")
        doLogin()
      }
    })
}

const doLogin = _kc.login

const doLogout = _kc.logout

const getToken = () => _kc.token

const updateToken = (successCallback) => {
  return _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin)
}

const getUsername = () => _kc.tokenParsed.preferred_username

export default {
  initKeycloak,
  doLogin,
  doLogout,
  getToken,
  updateToken,
  getUsername,
  axiosInstance
}