module.exports = (req, res) => new Promise(resolve => {
  let data = ''
  req.on('data', (chunk) => {
    data += chunk
  })
  req.on('end', () => {
    req.body = {}

    try {
      req.body = JSON.parse(data)
    } catch (error) {
      new URLSearchParams(data).forEach(
        (val, key) => req.body[key] = val
      )
    }

    resolve()
  })
})
