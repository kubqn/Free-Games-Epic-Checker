import ErrorMessage from '../../components/Error'
import ImageSlider from '../../components/Slider'

interface ScreenshotsProps {
  screenshots: string[]
}

const Screenshots = ({ screenshots }: ScreenshotsProps) => {
  if (!screenshots || screenshots.length === 0) {
    return (
      <>
        <ErrorMessage message='No screenshots available' />
      </>
    )
  }

  return <ImageSlider imageUrls={screenshots} />
}
export default Screenshots
