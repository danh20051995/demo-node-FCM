const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const notification = require('./notification')
const firebaseConfig = require('./credentials/firebaseConfig.json')

/**
 * Get view/assets
 */
module.exports.get = (req, res) => {
  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path
    .normalize(req.url.split('?').shift())
    .replace(/^(\.\.[/\\])+/, '')

  let pathname = path.join(__dirname, 'public', sanitizePath)

  // if !exist || is a directory, then look for ./public/index.html
  const exist = fs.existsSync(pathname)
  if (!exist || fs.statSync(pathname).isDirectory()) {
    pathname = path.join(__dirname, 'public', 'index.html')
  }

  // read file from file system
  try {
    const contentType = mime.lookup(pathname)
    const fileContent = fs.readFileSync(pathname, 'utf8').replace(
      '`@@firebaseConfig`',
      JSON.stringify(firebaseConfig, null, 2)
    )

    // based on the URL path, extract the file extention. e.g. .js, .doc, ...
    // if the file is found, set Content-Type and send data
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Length', fileContent.length)
    res.write(fileContent, 'utf8')
    return res.end()
  } catch (error) {
    res.statusCode = 500
    return res.end(`Error getting the file: ${error.message}.`)
  }
}

/**
 * Push notification
 */
module.exports.post = async (req, res) => {
  const { fcmToken = 'fake-FCM-token', via, title, body } = req.body

  const onSuccess = () => {
    res.statusCode = 204
    return res.end()
  }

  const onError = (error) => {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.write(JSON.stringify({ message: error.message }))
    return res.end()
  }

  const message = {
    data: {
      via,
      random: Math.random()
    },
    notification: {
      title,
      body
    },
    token: fcmToken
  }

  const pushPromise = via === 'service-account'
    ? notification.pushByServiceAccount(message)
    : notification.pushByServerKey(message)

  pushPromise
    .then(onSuccess)
    .catch(onError)
}
