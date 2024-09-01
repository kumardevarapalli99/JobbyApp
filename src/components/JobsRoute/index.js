import Cookies from 'js-cookie'
import {useEffect, useState} from 'react'
import {useHistory, Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {IoIosSearch} from 'react-icons/io'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {IoBagHandle} from 'react-icons/io5'

import './index.css'

const JobsRoute = props => {
  const {employmentTypesList, salaryRangesList} = props

  const [profileData, setProfileData] = useState(null)
  const [check, setCheck] = useState([])
  const [radio, setRadio] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [clickSearch, setClickSearch] = useState('')
  const [fetching, setFetching] = useState('')
  const [profileError, setProfileError] = useState('NO-ERROR')
  const [jobData, setJobData] = useState(null)

  const token = Cookies.get('jwt_token')
  const history = useHistory()

  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  useEffect(() => {
    const fetchingProfileData = async () => {
      const url = 'https://apis.ccbp.in/profile'
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      try {
        const response = await fetch(url, options)
        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
          setProfileError('NO-ERROR')
        } else {
          setProfileError('ERROR')
        }
      } catch (e) {
        console.log(e.message)
        setProfileError('ERROR')
      }
    }

    fetchingProfileData()
  }, [token])

  const joiningData = check.join(',')

  useEffect(() => {
    let isMounted = true
    setFetching('LOADING')
    const fetchJobData = async () => {
      try {
        const url = `https://apis.ccbp.in/jobs?employment_type=${joiningData}&minimum_package=${radio}&search=${clickSearch}`
        const options = {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        const response = await fetch(url, options)

        if (!response.ok) {
          setFetching('FAILURE')
          setProfileError('ERROR')
          throw new Error('Failed to fetch data')
        }

        const data = await response.json()
        if (isMounted) {
          setJobData(data)
          setFetching('SUCCESS')
        }
      } catch (error) {
        console.error('Error fetching job data:', error)
        if (isMounted) {
          setFetching('FAILURE')
          setProfileError('ERROR')
        }
      }
    }

    fetchJobData()

    return () => {
      isMounted = false
    }
  }, [token, clickSearch, joiningData, radio])

  useEffect(() => {
    if (jobData && jobData.jobs && jobData.jobs.length === 0) {
      setFetching('NO-JOBS')
    }
  }, [jobData])

  if (!profileData) {
    return (
      <div className="loader-container">
        <Loader height="80" width="80" color="#3498db" ariaLabel="loading" />
      </div>
    )
  }

  if (!jobData || !jobData.jobs) {
    return (
      <div className="loader-container">
        <Loader height="80" width="80" color="#3498db" ariaLabel="loading" />
      </div>
    )
  }

  const onChangeCheckBox = (id, checked) => {
    if (checked) {
      setCheck(prevState => {
        const newItem = employmentTypesList.find(
          each => each.employmentTypeId === id,
        )
        return [...prevState, newItem.employmentTypeId]
      })
    } else {
      setCheck(prevState =>
        prevState.filter(
          item =>
            item !==
            employmentTypesList.find(each => each.employmentTypeId === id)
              .employmentTypeId,
        ),
      )
    }
  }

  const onChangeRadioButton = id => {
    const newItem = salaryRangesList.find(each => each.salaryRangeId === id)
    setRadio(newItem.salaryRangeId)
  }

  const onChangeSearchInput = event => {
    setSearchInput(event.target.value)
  }

  const onClickSearch = () => {
    setClickSearch(searchInput)

    const filterData = jobData.jobs.filter(each =>
      each.title.toLowerCase().includes(searchInput.toLowerCase()),
    )

    setJobData(filterData)
  }

  const renderLoading = () => (
    <div className="loader-container">
      <Loader height="80" width="80" color="#3498db" ariaLabel="loading" />
    </div>
  )

  const onClickFailureButton = () => {
    history.push('/jobs')
  }

  const renderFailure = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-view-button"
        onClick={onClickFailureButton}
      >
        Retry
      </button>
    </div>
  )

  const jobs = jobData.jobs.map(each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    packagePerAnnum: each.package_per_annum,
    rating: each.rating,
    title: each.title,
  }))

  const renderSuccess = () => (
    <div className="job-center-inner-container">
      <div className="job-center-inner">
        <ul className="ul-job-container">
          {jobs.map(each => (
            <li key={each.id} className="job-li-container">
              <Link to={`/jobs/${each.id}`} className="link">
                <div className="company-logo-container">
                  <img
                    src={each.companyLogoUrl}
                    alt="company logo"
                    className="company-logo"
                  />
                  <div className="title-rating-container">
                    <p className="title">{each.title}</p>
                    <div className="star-icon-container">
                      <FaStar className="star" />
                      <p className="rating">{each.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="location-employmentType-container">
                  <div className="location-employment">
                    <div className="location-container">
                      <MdLocationOn className="location-icon" />
                      <p className="location">{each.location}</p>
                    </div>
                    <div className="location-container">
                      <IoBagHandle className="location-icon" />
                      <p className="location">{each.employmentType}</p>
                    </div>
                  </div>
                  <p className="package-per-annum">{each.packagePerAnnum}</p>
                </div>
                <hr className="line" />
                <div className="description-container">
                  <p className="description-heading">Description</p>
                  <p className="job-description">{each.jobDescription}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  const renderNoJobs = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
    </div>
  )

  const renderProfileData = () => (
    <>
      <div className="profile-container">
        <img
          src={profileData.profile_details.profile_image_url}
          alt={profileData.profile_details.name}
          className="profile-icon"
        />
        <h1 className="profile-name">{profileData.profile_details.name}</h1>
        <p className="profile-data">{profileData.profile_details.short_bio}</p>
      </div>
    </>
  )

  const renderProfileError = () => (
    <>
      <div className="profile-error">
        <button
          type="button"
          className="failure-view-button"
          onClick={onClickFailureButton}
        >
          Retry
        </button>
      </div>
    </>
  )

  const renderProfile = () => {
    switch (profileError) {
      case 'NO-ERROR':
        return renderProfileData()
      case 'ERROR':
        return renderProfileError()
      default:
        return null
    }
  }

  const renderAll = () => {
    switch (fetching) {
      case 'LOADING':
        return renderLoading()
      case 'SUCCESS':
        return renderSuccess()
      case 'FAILURE':
        return renderFailure()
      case 'NO-JOBS':
        return renderNoJobs()
      default:
        return null
    }
  }

  return (
    <div className="jobs-main-container">
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
      <div className="jobs-inner-container">
        <div className="jobs-side-container">
          {renderProfile()}
          <hr className="horizontal-line1" />
          <div className="employment-container">
            <p className="employment-type">Type of Employment</p>
            <ul className="employment-ul-container">
              {employmentTypesList.map(each => (
                <li
                  key={each.employmentTypeId}
                  className="employment-li-container"
                >
                  <input
                    type="checkbox"
                    className="employment-check-box"
                    onChange={event =>
                      onChangeCheckBox(
                        each.employmentTypeId,
                        event.target.checked,
                      )
                    }
                  />
                  <label className="employment-label">{each.label}</label>
                </li>
              ))}
            </ul>
          </div>
          <hr className="horizontal-line2" />
          <div className="employment-container">
            <p className="employment-type">Salary Range</p>
            <ul className="employment-ul-container">
              {salaryRangesList.map(each => (
                <li
                  key={each.salaryRangeId}
                  className="employment-li-container"
                >
                  <input
                    id={`radio-${each.salaryRangeId}`}
                    type="radio"
                    className="employment-check-box"
                    name="salaryRange"
                    onChange={() => onChangeRadioButton(each.salaryRangeId)}
                  />
                  <label
                    htmlFor={`radio-${each.salaryRangeId}`}
                    className="employment-label"
                  >
                    {each.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="jobs-search-container">
          <div>
            <div className="search-container">
              <input
                id="search"
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchInput}
                onChange={onChangeSearchInput}
              />
              <button
                type="button"
                onClick={onClickSearch}
                className="search-button"
                aria-label="Search"
                title="Search"
              >
                <IoIosSearch className="search-icon" />
              </button>
            </div>
          </div>
          {renderAll()}
        </div>
      </div>
    </div>
  )
}

export default JobsRoute
