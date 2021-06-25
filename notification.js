const https = require('https')
const firebase = require('./firebase')

module.exports.pushByServiceAccount = function (message) {
  return firebase.pushNotification(message)
}

/**
 * Push FCM message with googleapis using gapis key
 * https://firebase.google.com/docs/cloud-messaging/send-message#send_messages_using_the_legacy_app_server_protocols
 * @returns {Promise}
 */
module.exports.pushByServerKey = ({
  notification = {},
  data = {
    /** link: '' */
  },
  token = [
    /** '' */
  ],
}) => {
  const url = 'https://fcm.googleapis.com/fcm/send'

  const dataString = JSON.stringify({
    data,
    webpush: { fcm_options: data },
    registration_ids: Array.isArray(token) ? token : [token],
    notification: {
      title: 'title',
      body: 'body',
      sound: 'default',
      ...notification,
    },
  })

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'key=' + process.env.FCM_SERVER_KEY,
    },
  }

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode} | ${res.statusMessage}`))
      }

      const body = []
      res.on('data', (chunk) => body.push(chunk))
      res.on('end', () => {
        const resString = Buffer.concat(body).toString()
        resolve(resString)
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request time out'))
    })

    req.write(dataString)
    req.end()
  })
}
