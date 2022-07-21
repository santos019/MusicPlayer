<template>
<div @click="detailDataModalClose($event)">
  <div class="player-container">
      <div class="player-header-container">
          header
      </div>
      <div class="player-body-container">
        <PlayerController @playButtonChange = "playButtonChange" ref="controller"></PlayerController>
      </div>
      <div class="player-list-container">
          <PlayerList ref="list" @fromListToController = "fromListToController"></PlayerList>
      </div>
      <div v-if="playListContetModalOffset || modifyPlayListModalOffset" class="displayBack-container"></div>
  </div>
  </div>
</template>

<script>
import PlayerController from '../components/PlayerController.vue'
import PlayerList from '../components/PlayerList.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
    components: {
        PlayerController,
        PlayerList
    },
    computed: {
        ...mapGetters(
            ['playListContetModalOffset', 'modifyPlayListdataOffset', 'modifyPlayListModalOffset']
        )
    },
    created () {
        this.SET_CURRENTMUSIC_INIT()
        this.FETCH_RANDOMMUSIC_LIST()
    },
    methods: {
        ...mapMutations([
            'SET_CURRENTMUSIC_INIT',
            'FETCH_RANDOMMUSIC_LIST',
            'CHANGE_MODAL_OFFSET',
            'CHANGE_MODIFY_MODAL_OFFSET',
            'CHANGE_PLAYLIST_DETAIL_OFFSET'
        ]),
        fromListToController () {
            this.$refs.controller.initPlayMusic()
        },
        playButtonChange (playButton) {
            console.log('playButton', playButton)
        },
        detailDataModalClose (event) {
            if (this.modifyPlayListdataOffset && event.target.className !== 'fa-solid fa-ellipsis-vertical') {
                this.CHANGE_MODAL_OFFSET(!this.modifyPlayListdataOffset)
            } else if (this.modifyPlayListModalOffset && !event.target.classList.contains('unclik')) {
                this.CHANGE_MODIFY_MODAL_OFFSET(!this.modifyPlayListModalOffset)
            } else if (this.playListContetModalOffset && !event.target.classList.contains('unclick-2')) {
                this.CHANGE_PLAYLIST_DETAIL_OFFSET(!this.playListContetModalOffset)
            }
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
.displayBack-container{
    top: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0.5;
    z-index: 4;
    background: rgb(159, 159, 159);
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background-color: #242424;
}
::-webkit-scrollbar-track {background: #242424; -webkit-border-radius: 10px; border-radius:10px;}
::-webkit-scrollbar-thumb {height: 50px; width: 50px; background: rgb(137, 137, 137); -webkit-border-radius: 8px; border-radius: 8px; -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,.1)}
</style>
