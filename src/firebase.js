const admin = require('firebase-admin')
const serviceAccount = require('../credentials/service-account.json')

const firebase = admin.initializeApp({
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  credential: admin.credential.cert(serviceAccount),
})

/**
 * @param {object} data
 * @returns {object}
 */
function normalizeData(data) {
  data = data || {}

  for (const key of Object.keys(data)) {
    if (typeof data[key] !== 'string') {
      data[key] = String(data[key])
    }
  }

  return data
}

/**
 * @param {object} message
 * @returns {Promise}
 */
function pushNotification(message) {
  const {
    data,
    notification = {
      title: 'Notification title',
      body: `Notification body: ${Math.random()}`,
      // sound: 'default'
    },
  } = message

  const _data = normalizeData(data)
  const timestamp = new Date().toISOString()
  const imageUrl = 'https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png'
  const notificationCount = Math.floor(Math.random() * 100)

  /**
   * https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
   * @type {import('firebase-admin/lib/messaging/messaging-api').BaseMessage}
   */
  const fcmMessage = {
    ...message,

    // data accept string only
    data: _data,
    notification,
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig
    android: {
      notification: {
        imageUrl,
        notificationCount
      },
      data: {
        ..._data,
        platform: 'Android',
        time: timestamp,
      },
    },
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#WebpushConfig
    webpush: {
      notification: {
        ...notification,
        icon: imageUrl,
        badge: imageUrl,
      },
      // data accept string only
      data: {
        ..._data,
        platform: 'WebPush',
        time: timestamp,
      },
    },
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
    // Payload of Apple Push Notification Service must contain an [aps] key.
    apns: {
      fcmOptions: {
        imageUrl
      },
      payload: {
        aps: {
          badge: notificationCount
        }
      }
    },
  }

  return firebase
    .messaging()
    .send(fcmMessage)
    .catch((error) => {
      if (error.code === 'messaging/registration-token-not-registered') {
        console.log('Token invalid.')
      }

      throw error
    })
}

module.exports.normalizeData = normalizeData
module.exports.pushNotification = pushNotification
