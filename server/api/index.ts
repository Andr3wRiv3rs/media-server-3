import { handler } from "../"
import { drives } from "../filesystem/drives"
import path from "path"
import fs from "fs"
import { getMediaType } from "../filesystem/mediatype"
import { MEDIA_CHUNK_SIZE } from "../constants"

handler("GET", /^\/$/, ({ res }) => {
  res.write("Hello world!")
  res.end()
})

handler("GET", /^\/dir\?dir=(.*)$/, ({ res }) => {
  const query = RegExp.$1

  const dir = /^\/?$/.test(query) 
    ? drives
    : fs.readdirSync(path.resolve(query))

  res.setHeader("Content-Type", "application/json")
  res.write(JSON.stringify(dir))
  res.end()
})

handler("GET", /^\/media\?file=(.*)$/, ({ res, req }) => {
  const query = decodeURIComponent(RegExp.$1)
  const [dir, file] = query.split(/\\\\?(?!.*\\)/)

  const mediaType = getMediaType(file)

  switch (mediaType) {
    case "video":
    case "audio": {
      const range = req.headers.range || `0`
      const stats = fs.statSync(query)

      const start = Number(range.replace(/\D/g, ""))
      const end = Math.min(start + MEDIA_CHUNK_SIZE, stats.size - 1)
      const contentLength = end - start + 1

      const headers = {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": mediaType === 'video' 
          ? "video/mp4"
          : "audio/mp3",
      }
    
      res.writeHead(206, headers)

      const videoStream = fs.createReadStream(query, { start, end })

      videoStream.pipe(res)

      break
    }

    default:
      console.error("couldn't find media type")
  }
})