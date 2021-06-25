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

  // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages
  const messageInfo = {
    ...message,

    // data accept string only
    data: _data,
    notification,
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#AndroidConfig
    android: {
      priority: 'NORMAL',
      notification,
      data: {
        ..._data,
        platform: 'Android',
        time: timestamp,
      },
    },
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#WebpushConfig
    webpush: {
      notification,
      // data accept string only
      data: {
        ..._data,
        platform: 'webpush',
        time: timestamp,
      },
    },
    // https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages#ApnsConfig
    // Payload of Apple Push Notification Service must contain an [aps] key.
    // apns: {
    //   payload: {
    //     ..._data,
    //     platform: 'apns',
    //     time: timestamp,
    //   },
    // },
  }

  return firebase
    .messaging()
    .send(messageInfo)
    .catch((error) => {
      if (error.code === 'messaging/registration-token-not-registered') {
        console.log('Token invalid.')
      }

      throw error
    })
}

module.exports.normalizeData = normalizeData
module.exports.pushNotification = pushNotification
