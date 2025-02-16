// Network Speed Test Server using WebSockets and WebRTC
import 'dotenv/config'
import cors from 'cors'
import express, { json } from 'express'
import http from 'http'
import fs from 'node:fs'
import path from 'node:path'
import { WebSocketServer } from 'ws'
import multer from "multer";

const app = express()
app.use(cors())
app.use(json())


// UPLOAD
const upload = multer({ storage: multer.memoryStorage() });
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ success: true });
});

// LATENCY
const server = http.createServer(app)
const wss = new WebSocketServer({ server })
wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', (message) => {
    const serverStart = performance.now()

    if (message == 'Hi server!') {
      ws.send('Hi Client')
    } else {
      try {
        const data = JSON.parse(message)
        const serverEnd = performance.now()

        ws.send(
          JSON.stringify({
            clientStartTime: data.clientStartTime,
            serverTime: serverEnd,
            serverProcessingTime: performance.now() - serverStart
          })
        )
      } catch (error) {
        console.log(error.message)
        ws.send(error.message)
      }
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})


// DONWLOAD
app.get('/download', (req, res) => {
  const filePath = path.join(process.cwd(), 'public', 'download_test_25MB')
  const CHUNK_SIZE = 512 * 1000

  res.setHeader('Content-Type', 'application/octet-stream')
  res.setHeader('Cache-Control', 'no-cache')
  const readStream = fs.createReadStream(filePath, {
    // highWaterMark: CHUNK_SIZE
  })
  readStream.pipe(res)
})


// CREATING FILE
app.post('/file', (req, res) => {
  const { size } = req.body
  const filePath = path.join(process.cwd(), 'public', `download_test_${size}MB`)
  const file = 'x'.repeat(size * 1000 * 1000)
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, file) 
  }
})

server.listen(process.env.PORT, () => {
  console.log(`Speed test server running on port: ${process.env.PORT}`)
})
