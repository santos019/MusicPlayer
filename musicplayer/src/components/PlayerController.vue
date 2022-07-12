<template>
  <div class="playerController-container">
      <div class="playerController-img-container">
        hello~~~
      </div>
      <div class="playerController-heart-container">
            <i @mouseover="isHovering = true"  @mouseout="isHovering = false" v-bind:class="[ false || isHovering ? 'fa-solid fa-heart' : 'fa-regular fa-heart'  ]"></i>
      </div>
      <div class="playerController-playbar-container">
          <canvas class="playerController-playbar-canvas" width="400" ref="playerControllerPlaybarCanvasRef">
          </canvas>
           <audio id= "loadMusic" preload= 'auto' ref="audioRef">
               <source :src= "loadMusic" type="audio/mp3"/>
           </audio>
           <div class="playerContoller-playbar-time">
               00:00
            </div>
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
// import myMusic from '../assets/Music/Pray-AnnoDominiBeats.mp3'
export default {
    data () {
        return {
            isHovering: false, // store.item값으로 수정하기,
            loadMusic: testMusic,
            ctx: null,
            audioElement: null,
            playButton: false,
            playingMusic: null,
            playbarGauge: 0,
            playEndMusic: null,
            playDuration: 0,
            testData: [
                {
                    title: 'musicTitle',
                    time: 3.25
                },
                {
                    title: 'musicTitme2',
                    time: 4.05
                }
            ]
        }
    },
    computed: {
    },
    mounted () {
        this.ctx = this.$refs.playerControllerPlaybarCanvasRef.getContext('2d')
    },
    methods: {
        test (e) {
            console.log(e)
        },
        playMusicEnvt () {
            const loadMusic = this.$refs.audioRef
            console.log('재생')
            console.log('duration', loadMusic.duration)
            console.log('currentTime', loadMusic.currentTime)
            this.playButton = !this.playButton
            if (this.playButton) { // 노래가 로드 끝나면 실행되는것으로 변경
                loadMusic.play()
                const upGauge = 400 / loadMusic.duration
                console.log('upgauge', upGauge)
                this.playingMusic = setInterval(() => {
                    let playingGuage = loadMusic.currentTime
                    console.log('currentTime', loadMusic.currentTime)
                    this.ctx.fillStyle = 'green'
                    this.playbarGauge = playingGuage * upGauge
                    this.ctx.fillRect(0, 0, this.playbarGauge, 100)
                    console.log('gautge', this.playbarGauge)
                }, 100)
                this.playEndMusic = setTimeout(() => {
                    clearInterval(this.playingMusic)
                    this.ctx.clearRect(0, 0, 400, 100)
                    this.playButton = false
                }, (loadMusic.duration - loadMusic.currentTime) * 1000 + 300)
            } else {
                console.log('정지')
                loadMusic.pause()
                clearInterval(this.playingMusic)
                clearTimeout(this.playEndMusic)
            }
            if (loadMusic.currentTime === 0) {
                this.ctx.clearRect(0, 0, 400, 100)
            }
        }
    }
}
</script>

<style>
.playerController-img-container {
    width: 100%;
    height: 180px;
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
    height: auto;
    background-color: rgb(116, 89, 53);
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
    width: 400px;
    height: 6px;
    background-color: azure;
}
.playerController-playbar-data-container{
}
.playerContoller-playbar-time{
    float: right;
    font-size: 11px;
    background-color: blue;
}
</style>
