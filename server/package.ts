import fs from "fs"
import path from "path"

const json = fs.readFileSync(path.resolve("package.json"), 'utf8')

export const {
  version,
} = JSON.parse(json) as {
  version: string
}
