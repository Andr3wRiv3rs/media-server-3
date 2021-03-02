import { handler } from "../"
import { drives } from "../filesystem/drives"
import path from "path"
import fs from "fs"

handler("GET", /^\/dir\?dir=(.*)$/, ({ res }) => {
  const query = RegExp.$1

  const dir = /^\/?$/.test(query) 
    ? drives
    : fs.readdirSync(path.resolve(query))

  res.setHeader("Content-Type", "application/json")
  res.write(JSON.stringify(dir))
  res.end()
})
