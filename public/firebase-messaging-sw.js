// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.6.8/firebase-messaging.js')

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = `@@firebaseConfig`


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig)

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )

  // Customize notification here
  self.registration.showNotification(payload.notification.title, {
    data: payload.notification.data && payload.notification.data.link,
    body: payload.notification.body,
    icon: '/favicon.ico',
    image: '/favicon.ico',
    // badge: '/favicon.ico'
  })
})

/**
 * Handler click notification event
 */
self.onnotificationclick = function (event) {
  // console.log({ event, clients })
  // console.log('On notification click: ', event.notification.tag);
  event.notification.close()

  const link = event.notification.data || '/'

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        includeUncontrolled: true,
        type: 'window',
      })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          let client = clientList[i]
          if (client.url === link && 'focus' in client) return client.focus()
        }

        if (clients.openWindow) return clients.openWindow(link)
      })
  )
}
