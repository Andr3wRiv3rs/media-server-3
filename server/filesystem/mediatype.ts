export const getMediaType = (file: string): 'video' | 'audio' | 'other' => {
  switch (true) {
    case /.(mp4|webm)/.test(file): return 'video'
    case /.(mp3|ogg)/.test(file): return 'audio'
    default: return 'other'
  }
}
