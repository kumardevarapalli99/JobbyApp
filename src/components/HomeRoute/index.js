import Cookies from 'js-cookie'
import {useHistory, Link, Redirect} from 'react-router-dom'
import './index.css'

const HomeRoute = () => {
  const history = useHistory()
  const token = Cookies.get('jwt_token')

  if (token === undefined) {
    return <Redirect to="/login" />
  }

  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="home-main-container">
      <nav className="nav-container">
        <ul className="ul-nav-container">
          <li className="li-nav-container">
            <Link to="/">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="nav-logo"
              />
            </Link>
          </li>
          <li>
            <div className="home-jobs-container">
              <Link to="/" className="link">
                <p className="home">Home</p>
              </Link>
              <Link to="/jobs" className="link">
                <p className="home">Jobs</p>
              </Link>
            </div>
          </li>
          <li>
            <button
              type="button"
              onClick={onClickLogOut}
              className="log-out-button"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <div className="find-jobs-inner-container">
        <div className="find-jobs-inner-inner">
          <h1 className="find-jobs-heading">
            Find The Job That Fits Your Life
          </h1>
          <p className="find-jobs-para">
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits your abilities and
            potential.
          </p>
          <Link to="/jobs" className="link">
            <button type="button" className="find-jobs-button">
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomeRoute
