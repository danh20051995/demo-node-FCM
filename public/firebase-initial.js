// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = `@@firebaseConfig`

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// [START get_messaging_object]
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging()
// [END get_messaging_object]

messaging.onMessage((payload) => {
  console.log('Message received: ', payload)
  toastr.info(payload.notification.body, payload.notification.title)
})

navigator
  .serviceWorker
  .register('/firebase-messaging-sw.js')
  .then(async (registration) => {
    messaging.useServiceWorker(registration)

    // Request permission and get token.....
    await messaging.requestPermission().catch((error) => {
      toastr.error(error.message, 'Request permission error')
      throw error
    })

    messaging
      .getToken()
      .then((fcmToken) => {
        toastr.success('Get FCM token successfully!')
        document.getElementById('fcm-token').innerHTML = fcmToken
        document.getElementById('fcm-token').style.display = ''
        window.getFcmToken = function () {
          return fcmToken
        }
      })
      .catch((error) => {
        document.getElementById('fcm-token').style.display = 'none'
        toastr.error(error.message, 'Get FCM token error')
        throw error
      })
  })
