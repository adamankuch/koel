<template>
  <article class="album-info" :class="mode" data-test="album-info">
    <h1 class="name">
      <span>{{ album.name }}</span>
      <button :title="`Shuffle all songs in ${album.name}`" @click.prevent="shuffleAll" class="shuffle control">
        <i class="fa fa-random"></i>
      </button>
    </h1>

    <main>
      <AlbumThumbnail :entity="album"/>

      <template v-if="album.info">
        <div class="wiki" v-if="album.info.wiki?.summary">
          <div class="summary" v-if="showSummary" v-html="album.info.wiki?.summary"></div>
          <div class="full" v-if="showFull" v-html="album.info.wiki.full"></div>

          <button class="more" v-if="showSummary" @click.prevent="showingFullWiki = true" data-test="more-btn">
            Full Wiki
          </button>
        </div>

        <TrackList :album="album" v-if="album.info.tracks?.length" data-test="album-info-tracks"/>

        <footer>Data &copy; <a target="_blank" rel="noopener" :href="album.info.url">Last.fm</a></footer>
      </template>
    </main>

  </article>
</template>

<script lang="ts" setup>
import { sharedStore } from '@/stores'
import { auth, playback } from '@/services'
import { computed, defineAsyncComponent, defineProps, Prop, ref, watch } from 'vue'

const TrackList = defineAsyncComponent(() => import('./track-list.vue'))
const AlbumThumbnail = defineAsyncComponent(() => import('@/components/ui/album-artist-thumbnail.vue'))

const album = defineProps<{ album: Album }>().album

const mode = defineProps({
  mode: {
    default: 'sidebar',
    required: true
  } as Prop<'sidebar' | 'full'>
}).mode

const showingFullWiki = ref(false)

/**
 * Whenever a new album is loaded into this component, we reset the "full wiki" state.
 */
watch(album, () => (showingFullWiki.value = false))

const showSummary = computed(() => mode !== 'full' && !showingFullWiki.value)
const showFull = computed(() => !showSummary.value)

const shuffleAll = () => playback.playAllInAlbum(album)
</script>

<style lang="scss">
.album-info {
  @include artist-album-info();
}
</style>
