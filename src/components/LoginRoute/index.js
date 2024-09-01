import {useState} from 'react'
import {useHistory, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const LoginRoute = () => {
  const [username, setUserName] = useState('')
  const [password, setPassWord] = useState('')
  const [err, setErr] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const history = useHistory()

  const handleUsername = event => {
    setUserName(event.target.value)
  }

  const handlePassword = event => {
    setPassWord(event.target.value)
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  const handleSubmitButton = async e => {
    e.preventDefault()

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        onSubmitSuccess(data.jwt_token)
        setErr(false)
        setUserName('')
        setPassWord('')
      } else {
        const data = await response.json()
        setErr(true)
        setErrorMsg(data.error_msg)
      }
    } catch (error) {
      setErrorMsg(error.message)
      setErr(true)
    }
  }

  const token = Cookies.get('jwt_token')

  if (token !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-main-container">
      <form onSubmit={handleSubmitButton} className="form-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo"
        />
        <div className="form-inner-container">
          <div className="label-input-container">
            <label htmlFor="username" className="username">
              USERNAME
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsername}
              className="username-input"
            />
          </div>

          <div className="label-input-container">
            <label htmlFor="password" className="username">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePassword}
              className="username-input"
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
          {err ? <p className="error-message">{`*${errorMsg}`}</p> : ''}
        </div>
      </form>
    </div>
  )
}

export default LoginRoute
