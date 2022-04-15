<template>
  <BaseContextMenu extra-class="artist-menu" ref="base" data-testid="artist-context-menu">
    <template v-if="artist">
      <li data-test="play" @click="play">Play All</li>
      <li data-test="shuffle" @click="shuffle">Shuffle All</li>
      <template v-if="isStandardArtist">
        <li class="separator"></li>
        <li data-test="view-artist" @click="viewArtistDetails">Go to Artist</li>
      </template>
      <template v-if="isStandardArtist && sharedState.allowDownload">
        <li class="separator"></li>
        <li data-test="download" @click="download">Download</li>
      </template>
    </template>
  </BaseContextMenu>
</template>

<script lang="ts" setup>
import { BaseContextMenu as TBaseContextMenu } from 'koel/types/ui'
import { artistStore, sharedStore } from '@/stores'
import { download as downloadService, playback } from '@/services'
import router from '@/router'
import { computed, defineAsyncComponent, reactive, ref } from 'vue'

const BaseContextMenu = defineAsyncComponent(() => import('@/components/ui/context-menu.vue'))
const base = ref<TBaseContextMenu>()

const artist = defineProps<{ artist: Artist }>().artist

const sharedState = reactive(sharedStore.state)

const isStandardArtist = computed(() => !artistStore.isUnknownArtist(artist) && !artistStore.isVariousArtists(artist))

const open = (top: number, left: number) => base.value?.open(top, left)
const play = () => playback.playAllByArtist(artist)
const shuffle = () => playback.playAllByArtist(artist, true /* shuffled */)
const close = () => base.value?.close()

const viewArtistDetails = () => {
  router.go(`artist/${artist.id}`)
  close()
}

const download = () => {
  downloadService.fromArtist(artist)
  close()
}
</script>
