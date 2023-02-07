import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const StationKey = 'Admin-Station'
const SystemId = 'Admin-System'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getStationId() {
  return Cookies.get(StationKey)
}

export function setStationId(stationId) {
  return Cookies.set(StationKey, stationId)
}

export function removeStationId() {
  return Cookies.remove(StationKey)
}

export function getSystemId() {
  return Cookies.get(SystemId)
}

export function setSystemId(stationId) {
  return Cookies.set(SystemId, stationId)
}

export function removeSystemId() {
  return Cookies.remove(SystemId)
}
