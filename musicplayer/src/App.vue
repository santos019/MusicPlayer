<template>
  <div id="app">
    <Player></Player>
  </div>
</template>
<script>
import Player from './views/Player.vue'
export default {
    components: {
        Player
    }
}
</script>
<style>
@font-face {
     font-family: 'S-CoreDream-3Light';
     src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff') format('woff');
     font-weight: normal;
     font-style: normal;
}
* { font-family: 'S-CoreDream-3Light'; }
</style>
