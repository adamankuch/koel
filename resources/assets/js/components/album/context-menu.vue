<template>
  <BaseContextMenu extra-class="album-menu" ref="base" data-testid="album-context-menu" ref="base">
    <template v-if="album">
      <li data-test="play" @click="play">Play All</li>
      <li data-test="shuffle" @click="shuffle">Shuffle All</li>
      <li class="separator"></li>
      <li data-test="view-album" @click="viewAlbumDetails" v-if="isStandardAlbum">Go to Album</li>
      <li data-test="view-artist" @click="viewArtistDetails" v-if="isStandardArtist">Go to Artist</li>
      <template v-if="isStandardAlbum && sharedState.allowDownload">
        <li class="separator"></li>
        <li data-test="download" @click="download">Download</li>
      </template>
    </template>
  </BaseContextMenu>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import { BaseContextMenu as TBaseContextMenu } from 'koel/types/ui'
import { albumStore, artistStore, sharedStore } from '@/stores'
import { download as downloadService, playback } from '@/services'
import router from '@/router'

const BaseContextMenu = defineAsyncComponent(() => import('@/components/ui/context-menu.vue'))

const base = ref<TBaseContextMenu | null>(null)

const album = defineProps<{ album: Album }>().album

const sharedState = reactive(sharedStore.state)

const isStandardAlbum = computed(() => !albumStore.isUnknownAlbum(album))

const isStandardArtist = computed(() => {
  return !artistStore.isUnknownArtist(album.artist) && !artistStore.isVariousArtists(album.artist)
})

const close = () => base.value?.close()

const open = (top: number, left: number) => base.value?.open(top, left)
const play = () => playback.playAllInAlbum(album)

const shuffle = () => playback.playAllInAlbum(album, true /* shuffled */)

const viewAlbumDetails = () => {
  router.go(`album/${album.id}`)
  close()
}

const viewArtistDetails = () => {
  router.go(`artist/${album.artist.id}`)
  close()
}

const download = () => {
  downloadService.fromAlbum(album)
  close()
}
</script>
