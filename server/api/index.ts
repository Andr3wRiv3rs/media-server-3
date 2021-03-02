import { handler } from "../"
import { version } from "../package"

handler("GET", /^\/$/, ({ res }) => {
  res.write(`Apple's media server v${version}`)
})

Promise.allSettled([
  import('./dir'),
  import('./file'),
]).then(() => { 
  console.log('API loaded')
}).catch(console.error)
