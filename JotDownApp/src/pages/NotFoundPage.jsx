import { Link } from 'react-router-dom'
import './NotFoundPage.css'

function NotFoundPage() {
  return (
    <div
      className="not-found-page"
      style={{
        backgroundImage:
          'url(https://res.cloudinary.com/dkrag40hw/image/upload/v1777844340/note-attachments/yo2xdfbckgimlm8tygux.png)',
      }}
    >
      <div className="not-found-overlay" />
      <div className="not-found-content">
        <h1 className="not-found-title" data-text="404">
          404
        </h1>
        <p className="not-found-subtitle">Not Found!</p>
        <Link to="/landing" className="not-found-btn">
          Trở về Trang chính
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
