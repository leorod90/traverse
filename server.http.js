const http = require('http')

const todos = [
  { id: 1, text: 'Buy' },
  { id: 2, text: 'Trade' },
  { id: 3, text: 'Sell' }
]

const server = http.createServer((req, res) => {
  // res.statusCode = 201
  // res.setHeader('Content-type', 'application/json')
  // res.setHeader('X-Powered-By', 'Node.js')
  // res.write('Hello')
  const { method, url } = req

  let body = []
  let status = 404
  const response = {
    success: false,
    data: null
  }

  req.on('data', chunk => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()

    if (method === 'GET' && url === '/todos') {
      status = 200
      response.success = true;
      response.data = todos
    } else if (method === 'POST' && url === '/todos') {
      const { id, text } = JSON.parse(body)

      if (!id || !text) {
        status = 400
        
      } else {
        status = 201
        todos.push({ id, text })
        response.success = true;
        response.data = todos
      }

    }

    res.writeHead(status, {
      'Content-type': 'application/json',
      'X-Powered-By': 'Node.js'
    })

    res.end(JSON.stringify(response))
  })
})

const PORT = 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))