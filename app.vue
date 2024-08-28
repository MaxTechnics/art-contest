<template>
  <div>
    <!-- <NuxtRouteAnnouncer /> -->
    <!-- <NuxtWelcome /> -->
    <ClientOnly>
      <!-- <canvas id="getlost" style="height: 100vh; width: 100%; pointer-events: none; position: fixed; z-index: 99999999999;"></canvas> -->
      <NuxtPage />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'r/JaidenAnimations Art Contest',
  ogTitle: 'My Amazing Site',
  description: 'Second art contest of the r/JaidenAnimations subreddit',
  ogDescription: 'Second art contest of the r/JaidenAnimations subreddit',
  ogImage: '/preview.png',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    { src: '/masonry.pkgd.min.js' },
    { src: '/modernizr-custom.js' },
    { src: '/imagesloaded.pkgd.min.js' },
    { src: '/confettprep.js' },
    { src: '/confett.js', defer: true }
  ],
  link: [
    { rel: 'icon', type: 'image/gif', href: '/jdn.gif' },
  ]
})
</script>
