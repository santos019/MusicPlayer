<template>
  <div class="playerController-container">
      <div class="playerController-img-container">
        hello~~~
      </div>
      <div class="playerController-heart-container">
            <i @mouseover="isHovering = true"  @mouseout="isHovering = false" v-bind:class="[ false || isHovering ? 'fa-solid fa-heart' : 'fa-regular fa-heart'  ]"></i>
      </div>
      <div class="playerController-playbar-container">
          <canvas class="playerController-playbar-canvas" ref="playerControllerPlaybarCanvasRef">
          </canvas>
           <audio id= "loadMusic" preload= 'auto'>
               <source v-bind:src= "datatt" type="audio/mp3"/>
           </audio>
      </div>
      <div class="playerController-playbar-data-container">
          <i class="fa-solid fa-volume-off"></i>
      </div>
      <div class="playerController-playmenu-container">
          <i class="fa-solid fa-repeat"></i>
          <i class="fa-solid fa-backward-step"></i>
          <i v-bind:class="[ playButton ? 'fa-solid fa-grip-lines-vertical' : 'fa-solid fa-play' ]" @click="playMusicEnvt"></i>
          <i class="fa-solid fa-forward-step"></i>
          <i class="fa-solid fa-shuffle"></i>
      </div>
  </div>
</template>

<script>
import testMusic from '../assets/Music/YourIntroAudionautix.mp3'
export default {
  data () {
    return {
      isHovering: false, // store.item값으로 수정하기,
      datatt: testMusic,
      ctx: null,
      playButton: false,
      playingMusic: null
    }
  },
  mounted () {
    this.ctx = this.$refs.playerControllerPlaybarCanvasRef.getContext('2d')
  },
  methods: {
    test (e) {
      console.log(e)
    },
    playMusicEnvt () {
      const loadMusic = document.getElementById('loadMusic')
      console.log('duration', loadMusic.duration)
      console.log('currentTime', loadMusic.currentTime)
      console.log(this.playButton)
      this.playButton = !this.playButton
      if (this.playButton) {
        loadMusic.play()
        const upGuage = 400 / loadMusic.duration
        this.ctx.clearRect(45, 45, 60, 60)
        loadMusic.currentTime = 0
        this.playingMusic = setInterval(() => {
          let playingGuage = loadMusic.currentTime
          console.log('currentTime', loadMusic.currentTime)
          this.ctx.fillStyle = 'green'
          this.ctx.fillRect(0, 0, playingGuage * upGuage, 100)
        }, 1000)
        console.log(loadMusic.duration)
      }
      setTimeout(() => {
        clearInterval(this.playingMusic)
        if (this.playButton) {
          this.ctx.clearRect(0, 0, 400, 100); this.playButton = false
        } else {
          loadMusic.pause()
        }
      }, this.playButton ? loadMusic.duration * 1000 : 0)
    }
  }
}
</script>

<style>
.playerController-img-container {
    width: 100%;
    height: 270px;
    background-color: brown;
}
.playerController-heart-container{
    display: flex;
    justify-content: center;
    height: 30px;
    background-color: aquamarine;
}
.playerController-playbar-container{
    width: 100%;
    height: 30px;
    background-color: chartreuse;
}
.playerController-playmenu-container{
    width: 100%;
    height: 70px;
    background-color: burlywood;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.playerController-heart-container > i {
    background: saddlebrown;
    cursor: pointer;
    font-size: 23px;
}
.playerController-playmenu-container > i {
    background-color: aqua;
    font-size: 30px;
    cursor: pointer;
}
.playerController-playmenu-container > i:hover {
    background-color: azure;
}
.playerController-playmenu-container i:nth-child(3) {
    font-size: 38px;
}
.playerController-playbar-canvas{
    width: 100%;
    height: 6px;
    background-color: azure;
}
.playerController-playbar-data-container{
}
</style>
