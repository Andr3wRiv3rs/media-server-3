import { handler } from "../"
import { version } from "../package"

handler("GET", /^\/$/, ({ res }) => {
  res.write(`Apple's media server v${version}`)
  res.end()
})

Promise.allSettled([
  import('./fs'),
  import('./media'),
]).then(() => { 
  console.log('API loaded')
}).catch(console.error)
