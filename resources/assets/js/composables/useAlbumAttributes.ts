import { computed } from 'vue'
import { secondsToHis } from '@/utils'

export const useAlbumAttributes = () => {
  const album = defineProps<{ album: Album }>().album
  const length = computed(() => album.songs.reduce((acc: number, song: Song) => acc + song.length, 0))
  const fmtLength = computed(() => secondsToHis(length.value))

  return {
    album,
    length,
    fmtLength
  }
}
