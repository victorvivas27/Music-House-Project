import { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import TematicCard from '../instrumentGallery/TematicCard'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { flexRowContainer } from '@/components/styles/styleglobal'

const AutoScrollCarousel = ({ themes }) => {
  const styleCarousel = {
    ...flexRowContainer,
    position: 'absolute',
    backgroundColor: 'var(--color-primario)',
    color: 'white',
    borderRadius: '50%',
    cursor: 'pointer',
    p: 1,
    userSelect: 'none',
    zIndex: 10
  }
  const carouselRef = useRef(null)
  const cardRef = useRef(null)

  const [isPaused, setIsPaused] = useState(false)
  const [showArrows, setShowArrows] = useState(false)

  const extendedThemes = [...themes, ...themes]

  const scrollLeft = () => {
    if (carouselRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth
      carouselRef.current.scrollLeft -= cardWidth
    }
  }

  const scrollRight = () => {
    if (carouselRef.current && cardRef.current) {
      const cardWidth = cardRef.current.offsetWidth
      carouselRef.current.scrollLeft += cardWidth
    }
  }

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

    const interval = setInterval(scroll, 10)
    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <Box
      sx={{
        width: '100vw',
        position: 'relative'
      }}
      onMouseEnter={() => {
        setIsPaused(true)
        setShowArrows(true)
      }}
      onMouseLeave={() => {
        setIsPaused(false)
        setShowArrows(false)
      }}
    >
      {/* Carrusel */}
      <Box
        ref={carouselRef}
        sx={{
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
            ref={index === 0 ? cardRef : null}
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
              imageUrlTheme={tematic?.imageUrlTheme}
            />
          </Box>
        ))}
      </Box>

      {/* Flechas */}
      {showArrows && (
        <>
          {/* Izquierda */}
          <Box
            onClick={scrollLeft}
            onMouseDown={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            sx={{
              top: '50%',
              left: 10,
              transform: 'translateY(-50%)',
              ...styleCarousel
            }}
          >
            <ArrowForwardIosIcon
              fontSize="small"
              sx={{ transform: 'rotate(180deg)' }}
            />
          </Box>

          {/* Derecha */}
          <Box
            onClick={scrollRight}
            onMouseDown={(e) => e.preventDefault()}
            role="button"
            tabIndex={0}
            sx={{
              top: '50%',
              right: 10,
              transform: 'translateY(-50%)',
              ...styleCarousel
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </Box>
        </>
      )}
    </Box>
  )
}

AutoScrollCarousel.propTypes = {
  themes: PropTypes.array.isRequired
}

export default AutoScrollCarousel
