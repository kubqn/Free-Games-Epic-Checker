import ReactPlayer from 'react-player'
import '../GameInfo.css'
import { YoutubeApiResponse } from '../../API/YouTubeApi'
import ErrorMessage from '../../components/Error'

const Videos = ({ videos }: YoutubeApiResponse) => (
  <div className='videos'>
    {videos ? (
      videos.map((video) => (
        <div key={video.id} className='video-item'>
          <p>{video.title}</p>
          <div className='video'>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${video.id}`}
              width='100%'
              height='280px'
              controls={true}
            />
          </div>
        </div>
      ))
    ) : (
      <ErrorMessage message='Cannot load any videos.' />
    )}
  </div>
)
export default Videos
