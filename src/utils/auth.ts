const TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'token:refresh'
const TOKEN_EXPIRY_KEY = 'token:expiry'

// Token有效期（默认24小时）
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000

function isLogin() {
  const token = getToken()
  if (!token) return false
  
  // 检查token是否过期
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (expiry) {
    const expiryTime = parseInt(expiry, 10)
    if (Date.now() > expiryTime) {
      clearToken()
      return false
    }
  }
  
  return true
}

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem('accessToken')
}
const getRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY)

function setRefreshToken(token: string) {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
}

function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('accessToken', token)
  
  // 设置token过期时间
  const expiryTime = Date.now() + TOKEN_EXPIRY
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
}

function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userRoles')
  localStorage.removeItem('userPermissions')
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
}

export { clearToken, getRefreshToken, getToken, isLogin, setRefreshToken, setToken }
