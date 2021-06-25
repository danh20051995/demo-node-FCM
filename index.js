require('dotenv').config()
const http = require('http')
const handler = require('./handler')
const bodyParse = require('./bodyParse')

// you can pass the parameter in the command line. e.g. node static_server.js 3000
const PORT = process.env.PORT || 3000

http
  .createServer((req, res) => {
    console.log(`${req.method} | ${req.url}`)

    switch (req.method) {
      case 'POST':
        return bodyParse(req, res).then(() => handler.post(req, res))
      default:
        return handler.get(req, res)
    }
  })
  .listen(parseInt(PORT), () => {
    console.log(`Server listening on port: ${PORT}`)
  })
