import { router } from "bitt"

router(document.body, [
  {
    regex: /$^/,
    component: ["h1", "hello world"],
  }
])
