<template>
  <div class="player-container">
      <div class="player-header-container">
          header
      </div>
      <div class="player-body-container">
        <PlayerController ref="controller"></PlayerController>
      </div>
      <div class="player-list-container">
          <PlayerList @fromListToController = "fromListToController"></PlayerList>
      </div>
  </div>
</template>

<script>
import PlayerController from '../components/PlayerController.vue'
import PlayerList from '../components/PlayerList.vue'
import { mapMutations } from 'vuex'
export default {
    components: {
        PlayerController,
        PlayerList
    },
    created () {
        this.SET_CURRENTMUSIC_INIT()
        this.FETCH_RANDOMMUSIC_LIST()
    },
    methods: {
        ...mapMutations([
            'SET_CURRENTMUSIC_INIT',
            'FETCH_RANDOMMUSIC_LIST'
        ]),
        fromListToController () {
            this.$refs.controller.playMusicEnvt()
            console.log('playerComponent')
        }
    }
}
</script>

<style>
.player-container{
    width: 400px;
    height: 98vh;
}
.player-header-container{
    width: 100%;
    height: 30px;
    background-color: #242424;
}
.player-body-container{
    width: 100%;
    height: 320px;
    background-color: #242424;
}
.player-list-container{
    height: 370px;
}
</style>
