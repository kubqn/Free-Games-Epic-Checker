self.addEventListener('push', function (event) {
  const data = event.data.json()
  const { title, body, url } = data

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: '/icon.png',
      actions: [
        {
          action: 'open_url',
          title: `Show games`,
        },
      ],
      data: { url },
      userVisibleOnly: true,
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const url = event.notification.data.url

  if (event.action === 'open_url' && url) {
    event.waitUntil(clients.openWindow(url))
  }
})
