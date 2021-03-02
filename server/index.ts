import HTTP from "http"
import { HTTPMethod, RequestCallback } from "./@types"
import { driveTask } from "./filesystem/drives"

const handlers: {
  method: HTTPMethod, 
  path: RegExp, 
  callbacks: RequestCallback<any>[],
}[] = []

/**
 * HTTP handler with middleware capability.
 */
export const handler = <State extends Record<string, unknown>> (
  method: HTTPMethod, 
  path: RegExp,
  ...callbacks: RequestCallback<State>[]
) => {
  handlers.push({
    method,
    path,
    callbacks
  })
}

const server = HTTP.createServer(async (req, res) => {
  const method = req.method as HTTPMethod
  const path = req.url

  res.setHeader("Content-Type", "text/plain; charset=utf-8")

  try {
    for (const handler of handlers) {
      if (method !== handler.method || !handler.path.test(path as string)) continue

      const state = {}

      let currentCallback = 0

      const props = {
        req, res, state,

        next: () => handler.callbacks[++currentCallback](props)
      }

      handler.callbacks[currentCallback](props)

      return
    }

    res.write("Not found")
    res.statusCode = 404
    res.end()
  } catch (error) {
    console.error(error)
    res.write('Internal server error')
    res.statusCode = 500
    res.end()
  }
})

const PORT = process.env.PORT || 11111

server.listen(PORT)

console.log(`Server listening on port ${PORT}`)

/**
 * Wait until drives are loaded.
 */
driveTask.then(() => {
  import('./api').catch(console.error)
})
