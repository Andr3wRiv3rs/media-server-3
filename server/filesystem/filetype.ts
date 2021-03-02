export const getFileType = (file: string) => {
  switch (true) {
    case /.(mp4|webm)/.test(file): return 'video'
    case /.(mp3|ogg)/.test(file): return 'audio'
    case /.(html)/.test(file): return 'html'
    default: return 'other'
  }
}
