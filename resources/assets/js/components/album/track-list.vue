<template>
  <section class="track-listing">
    <h1>Track Listing</h1>

    <ul class="tracks">
      <li
        :album="album"
        :key="idx"
        :index="idx"
        :track="track"
        is="TrackListItem"
        v-for="(track, idx) in album.info.tracks"
      />
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, defineProps } from 'vue'

const TrackListItem = defineAsyncComponent(() => import('./track-list-item.vue'))
const album = defineProps<{ album: Album }>().album
</script>
