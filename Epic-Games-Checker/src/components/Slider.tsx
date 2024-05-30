import { useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'
import { useMediaQuery } from '@react-hook/media-query'
import ReactDOM from 'react-dom'
import './Component.css'

interface ImageSliderProps {
  imageUrls: string[]
}

const ImageSlider = ({ imageUrls }: ImageSliderProps) => {
  const [imageIndex, setImageIndex] = useState<number>(0)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)
  const isLargeScreen = useMediaQuery('(min-width: 769px)')
  const fullSizeImage = imageUrls.map((url) => {
    return url.replace(
      /(https:\/\/cdn2\.unrealengine\.com\/[^\s]+\.jpg)\?.*/,
      '$1'
    )
  })

  const nextImage = () => {
    setImageIndex((index) => (index === imageUrls.length - 1 ? 0 : index + 1))
  }

  const prevImage = () => {
    setImageIndex((index) => (index === 0 ? imageUrls.length - 1 : index - 1))
  }

  const handleImageClick = (url: string) => {
    setFullscreenImage(url)
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  return (
    <>
      <div className='sliderContainer'>
        <div className='imgContainer'>
          {fullSizeImage.map((url, index) => (
            <img
              style={{ translate: `${-100 * imageIndex}%` }}
              key={index}
              className='sliderImg'
              src={url}
              alt={`Slide ${index}`}
              onClick={() => handleImageClick(fullSizeImage[index])}
            />
          ))}
        </div>
        <button
          onClick={prevImage}
          className='sliderBtn'
          style={{ left: '0px' }}
        >
          <FaAngleLeft size={24} />
        </button>
        <button
          onClick={nextImage}
          className='sliderBtn'
          style={{ right: '0px' }}
        >
          <FaAngleRight size={24} />
        </button>
      </div>
      <div className='imgBtn'>
        {isLargeScreen
          ? imageUrls.map((url, index) => (
              <img
                key={index}
                className={`${index === imageIndex ? 'active' : ''}`}
                src={url}
                onClick={() => setImageIndex(index)}
              />
            ))
          : imageUrls.map((url, index) => (
              <img
                key={index}
                className={index === imageIndex ? 'active' : ''}
                src={url}
                onClick={() => handleImageClick(fullSizeImage[index])}
                alt={`Thumbnail ${index}`}
              />
            ))}
      </div>
      {fullscreenImage &&
        ReactDOM.createPortal(
          <div className='fullscreen-img' onClick={closeFullscreen}>
            <img src={fullscreenImage} alt='Fullscreen' />
          </div>,
          document.getElementById('fullscreen-root')!
        )}
    </>
  )
}

export default ImageSlider
