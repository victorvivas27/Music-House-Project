import PropTypes from 'prop-types'
import './LoadingText.css' 

const LoadingText = ({ text = 'Cargando' }) => {
  return (
    <span className="loading-text">
    <span className="loading-label">{text}</span>
    <span style={{ color: 'red' }} className="dot">.</span>
    <span style={{ color: 'blue' }} className="dot">.</span>
    <span style={{ color: 'red' }} className="dot">.</span>
    <span style={{ color: 'blue' }} className="dot">.</span>
    <span style={{ color: 'red' }} className="dot">.</span>
  </span>
  )
}

export default LoadingText
LoadingText.propTypes = {
  text: PropTypes.string
}
