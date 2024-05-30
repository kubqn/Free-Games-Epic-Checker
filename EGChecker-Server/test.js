const axios = require('axios')

async function sendNotificationsToSubscribers() {
  const payload = {
    title: 'Nowe darmowe gry!',
    body: 'Sprawdź teraz nowe darmowe gry na Epic Games!',
  }

  try {
    const response = await axios.post(
      'http://localhost:3001/api/sendNotification',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    console.log('Notifications sent successfully:', response.data)
  } catch (error) {
    console.error(
      'Failed to send notifications:',
      error.response ? error.response.data : error.message
    )
  }
}

sendNotificationsToSubscribers()
