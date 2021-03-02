import path from "path"
import fs from "fs"
import { spawn } from "child_process"

export const drives: string[] = []

/**
 * Windows only, list all drives.
 */
const listDrives = () => {
  const list = spawn('cmd')

  return new Promise<string[]>(resolve => {
    list.stdout.on('data', (data: Buffer) => {
      const output = data.toString('utf8')

      const out = output
        .split("\r\n")
        .map(e => e.trim())
        .filter(e => e!="")

      if (out[0]==="Name"){
        resolve(out.slice(1))
      }
    })

    list.stdin.write('wmic logicaldisk get name\n')
    list.stdin.end()
  })
}

export const driveTask = listDrives().then(data => {
  data.forEach(drive => {
    drives.push(path.join(drive, '/'))
  })

  for (const i in drives) {
    const drive = drives[i]

    try {
      fs.readdirSync(drive)
    } catch (error) {
      console.error(`Failed to scan drive ${drive}`, error)
      drives.splice(Number(i), 1)
    }
  }
})