<template>
  <div class="player-container">
      <div class="player-header-container">
          header
      </div>
      <div class="player-body-container">
        <PlayerController @playButtonChange = "playButtonChange" ref="controller"></PlayerController>
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
            this.$refs.controller.initPlayMusic()
        },
        playButtonChange (playButton) {
            console.log('playButton', playButton)
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
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #242424;
}
::-webkit-scrollbar-track {background: #242424; -webkit-border-radius: 10px; border-radius:10px;}
::-webkit-scrollbar-thumb {height: 50px; width: 50px; background: rgb(137, 137, 137); -webkit-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.1)}
</style>
