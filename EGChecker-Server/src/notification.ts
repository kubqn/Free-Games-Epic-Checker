import axios from 'axios'

async function sendNotification() {
  try {
    const response = await axios.post(
      `${process.env.FRONT_URL}/api/sendNotification`,

      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    console.log('Response:', response.data)
  } catch (error) {
    console.error(
      'Error sending notification:',
      error.response ? error.response.data : error.message
    )
  }
}

export default sendNotification
