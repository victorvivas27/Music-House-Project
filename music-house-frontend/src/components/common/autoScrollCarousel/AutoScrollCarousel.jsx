import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import TematicCard from '../TematicCard'
const AutoScrollCarousel = ({ themes }) => {
  const carouselRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
const extendedThemes = [...themes, ...themes]
useEffect(() => {
    const container = carouselRef.current
    if (!container) return

    const scroll = () => {
      if (!isPaused) {
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0
        } else {
          container.scrollLeft += 1
        }
      }
    }
    const interval = setInterval(scroll, 15)
    const pauseScroll = () => setIsPaused(true)
    const resumeScroll = () => setIsPaused(false)
    container.addEventListener('mouseenter', pauseScroll)
    container.addEventListener('mouseleave', resumeScroll)
    container.addEventListener('touchstart', pauseScroll)
    container.addEventListener('touchend', resumeScroll)

    return () => {
      clearInterval(interval)
      container.removeEventListener('mouseenter', pauseScroll)
      container.removeEventListener('mouseleave', resumeScroll)
      container.removeEventListener('touchstart', pauseScroll)
      container.removeEventListener('touchend', resumeScroll)
    }
  }, [isPaused])

  return (
    <Box
      ref={carouselRef}
      sx={{
        width: '100vw',
        overflowX: 'scroll',
        overflowY: 'hidden',
        display: 'flex',
        flexWrap: 'nowrap',
        scrollBehavior: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      {extendedThemes.map((tematic, index) => (
        <Box
          key={`tematic-card-${index}`}
          sx={{
            flex: '0 0 auto',
            width: {
              xs: '78%',
              sm: '70%',
              md: '45%',
              lg: '40%'
            }
          }}
        >
          <TematicCard
            title={tematic.themeName}
            paragraph={tematic.description}
            imageUrl={
              tematic.imageUrls?.length > 0
                ? tematic.imageUrls[0].imageUrl
                : '/default-theme.jpg'
            }
          />
        </Box>
      ))}
    </Box>
  )
}

export default AutoScrollCarousel
AutoScrollCarousel.propTypes = {
  themes: PropTypes.array.isRequired
}
