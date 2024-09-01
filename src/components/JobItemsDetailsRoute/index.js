import {useParams, Link, useHistory} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'

import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {IoBagHandle} from 'react-icons/io5'
import {TiArrowForward} from 'react-icons/ti'

import './index.css'

const JobItemsDetailsRoute = () => {
  const {id} = useParams()
  console.log(id)

  const token = Cookies.get('jwt_token')

  const history = useHistory()

  const [jobDetailsData, setJobDetailsData] = useState(null)

  useEffect(() => {
    const fetchingJobDetailsData = async () => {
      const url = `https://apis.ccbp.in/jobs/${id}`
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const response = await fetch(url, options)
      const data = await response.json()

      setJobDetailsData(data)
    }

    fetchingJobDetailsData()
  }, [id, token])

  console.log(jobDetailsData)

  if (!jobDetailsData) {
    return <p>Loading...</p>
  }

  const jobDetails = {
    companyLogoUrl: jobDetailsData.job_details.company_logo_url,
    companyWebsiteUrl: jobDetailsData.job_details.company_website_url,
    employmentType: jobDetailsData.job_details.employment_type,
    id: jobDetailsData.job_details.id,
    jobDescription: jobDetailsData.job_details.job_description,
    location: jobDetailsData.job_details.location,
    packagePerAnnum: jobDetailsData.job_details.package_per_annum,
    rating: jobDetailsData.job_details.rating,
    title: jobDetailsData.job_details.title,
    lifeAtCompanyDescription:
      jobDetailsData.job_details.life_at_company.description,
    lifeAtCompanyImageUrl: jobDetailsData.job_details.life_at_company.image_url,
  }

  console.log(jobDetails)

  const skills = jobDetailsData.job_details.skills.map(each => ({
    imageUrl: each.image_url,
    name: each.name,
  }))

  console.log(skills)

  const similarJobs = jobDetailsData.similar_jobs.map(each => ({
    companyLogoUrl: each.company_logo_url,
    employmentType: each.employment_type,
    id: each.id,
    jobDescription: each.job_description,
    location: each.location,
    rating: each.rating,
    title: each.title,
  }))

  console.log(similarJobs)

  const onClickLogOut = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <div className="job-item-details-main-container">
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

      <div className="job-details-inner-container">
        <div className="job-details">
          <div className="job-center-inner-container">
            <div className="job-center-inner">
              <div className="company-logo-container">
                <img
                  src={jobDetails.companyLogoUrl}
                  alt="logo"
                  className="company-logo"
                />
                <div className="title-rating-container">
                  <p className="title">{jobDetails.title}</p>
                  <div className="star-icon-container">
                    <FaStar className="star" />
                    <p className="rating">{jobDetails.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-employmentType-container">
                <div className="location-employment">
                  <div className="location-container">
                    <MdLocationOn className="location-icon" />
                    <p className="location">{jobDetails.location}</p>
                  </div>
                  <div className="location-container">
                    <IoBagHandle className="location-icon" />
                    <p className="location">{jobDetails.employmentType}</p>
                  </div>
                </div>
                <p className="package-per-annum">
                  {jobDetails.packagePerAnnum}
                </p>
              </div>
              <hr className="line" />
              <div className="description-container">
                <div className="description-anchor-container">
                  <p className="description-heading">Description</p>
                  <div className="visit-arrow-container">
                    <a href={jobDetails.companyWebsiteUrl} className="visit">
                      Visit
                    </a>
                    <TiArrowForward className="visit-arrow" />
                  </div>
                </div>
                <p className="job-description">{jobDetails.jobDescription}</p>
              </div>

              <div className="skills-container">
                <h1 className="skills-heading">Skills</h1>
                <ul className="ul-skills-container">
                  {skills.map(each => (
                    <li className="li-skills-container">
                      <img
                        src={each.imageUrl}
                        alt={each.name}
                        className="skill-image"
                      />
                      <p className="skill-name">{each.name}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="life-at-company-container">
                <h1 className="life-at-company-heading">Life At Company</h1>
                <div className="life-at-company-div">
                  <div className="life-para-container">
                    <p className="life-at-company-para">
                      {jobDetails.lifeAtCompanyDescription}
                    </p>
                  </div>
                  <img
                    src={jobDetails.lifeAtCompanyImageUrl}
                    alt="life-at-company"
                    className="life-at-company-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="similar-jobs-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="ul-similar-jobs-container">
            {similarJobs.map(each => (
              <li className="li-similar-jobs-container">
                <div className="company-logo-container">
                  <img
                    src={each.companyLogoUrl}
                    alt="logo"
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

                <div className="description-container2">
                  <div className="description-anchor-container">
                    <p className="description-heading">Description</p>
                  </div>
                  <p className="job-description">{each.jobDescription}</p>
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default JobItemsDetailsRoute
