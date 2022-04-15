<template>
  <article
    :title="`${album.name} by ${album.artist.name}`"
    @dragstart="dragStart"
    class="item"
    :class="layout"
    draggable="true"
    tabindex="0"
    data-test="album-card"
    v-if="album.songs.length"
    @contextmenu.prevent="requestContextMenu"
    @dblclick="shuffle"
  >
    <span class="thumbnail-wrapper">
      <AlbumThumbnail :entity="album"/>
    </span>

    <footer>
      <div class="info">
        <a class="name" :href="`#!/album/${album.id}`">{{ album.name }}</a>
        <span class="sep text-secondary">by</span>
        <a
          class="artist"
          v-if="isNormalArtist"
          :href="`#!/artist/${album.artist.id}`"
        >{{ album.artist.name }}</a>
        <span class="artist nope" v-else>{{ album.artist.name }}</span>
      </div>
      <p class="meta">
        <span class="left">
          {{ pluralize(album.songs.length, 'song') }}
          •
          {{ fmtLength }}
          •
          {{ pluralize(album.playCount, 'play') }}
        </span>
        <span class="right">
          <a
            :title="`Shuffle all songs in the album ${album.name}`"
            @click.prevent="shuffle"
            class="shuffle-album"
            href
            role="button"
          >
            <i class="fa fa-random"></i>
          </a>
          <a
            :title="`Download all songs in the album ${album.name}`"
            @click.prevent="download"
            class="download-album"
            href
            role="button"
            v-if="sharedState.allowDownload"
          >
            <i class="fa fa-download"></i>
          </a>
        </span>
      </p>
    </footer>
  </article>
</template>

<script lang="ts" setup>
import { computed, defineAsyncComponent, Prop, reactive } from 'vue'
import { useAlbumAttributes } from '@/composables'
import { eventBus, pluralize, startDragging } from '@/utils'
import { artistStore, sharedStore } from '@/stores'
import { download as downloadService, playback } from '@/services'

const props = defineProps({
  layout: {
    type: String,
    default: 'full'
  } as Prop<ArtistAlbumCardLayout>
})

const AlbumThumbnail = defineAsyncComponent(() => import('@/components/ui/album-artist-thumbnail.vue'))
const { album, length, fmtLength } = useAlbumAttributes()
const sharedState = reactive(sharedStore.state)

const isNormalArtist = computed(() => {
  return !artistStore.isVariousArtists(album.artist) && !artistStore.isUnknownArtist(album.artist)
})

const shuffle = () => playback.playAllInAlbum(album, true /* shuffled */)
const download = () => downloadService.fromAlbum(album)
const dragStart = (event: DragEvent) => startDragging(event, album, 'Album')
const requestContextMenu = (event: MouseEvent) => eventBus.emit('ALBUM_CONTEXT_MENU_REQUESTED', event, album)
</script>

<style lang="scss">
.sep {
  display: none;

  .as-list & {
    display: inline;
  }
}

@include artist-album-card();
</style>
