import { handler } from "../"
import fs from "fs"
import { getMediaType } from "../filesystem/mediatype"
import { MEDIA_CHUNK_SIZE } from "../constants"

handler("GET", /^\/media\?file=(.*)$/, ({ res, req }) => {
  const query = decodeURIComponent(RegExp.$1)

  const mediaType = getMediaType(query)

  switch (mediaType) {
    case "video":
    case "audio": {
      const range = req.headers.range || `0`
      const stats = fs.statSync(query)

      const start = Number(range.replace(/\D/g, ""))
      const end = Math.min(start + MEDIA_CHUNK_SIZE, stats.size - 1)
      const contentLength = end - start + 1

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": mediaType === 'video' 
          ? "video/mp4"
          : "audio/mp3",
      })

      const stream = fs.createReadStream(query, { start, end })

      stream.pipe(res)

      break
    }

    default: {
      res.statusCode = 400
      res.write("Invalid media")
      res.end()
    }
  }
})
