<template>
  <div class="player-container">
      <div class="player-header-container">
          header
      </div>
      <div class="player-body-container">
        <PlayerController></PlayerController>
      </div>
      <div class="player-list-container">
          <PlayerList></PlayerList>
      </div>
  </div>
</template>

<script>
import PlayerController from '../components/PlayerController.vue'
import PlayerList from '../components/PlayerList.vue'
export default {
    components: {
        PlayerController,
        PlayerList
    }
}
</script>

<style>
.player-container{
    width: 400px;
    height: 98vh;
    background-color: aqua;
}
.player-header-container{
    width: 100%;
    height: 30px;
    background-color: rgb(39, 200, 39);
}
.player-body-container{
    width: 100%;
    height: 310px;
    background-color: blueviolet;
}
</style>
