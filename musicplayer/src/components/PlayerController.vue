<template>
  <div class="playerController-container">
      <div class="playerController-img-container">
        <img :src="currentMusic.musicData.thumbnail" class="playerController-img-img">
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
               {{makeMusicTimeFuc(Math.floor(currentMusicTime))}}/{{makeMusicTimeFuc(currentMusic.musicData.replaytime || 0)}}
            </div>
      </div>
      <div class="playerController-playbar-data-container">
          <div class="playerController-playbar-data-musicData-container">
              <div class="playerController-playbar-data-musicData-artist">
                  {{currentMusic.musicData.artist}}
              </div>
              <div class="playerController-playbar-data-musicData-music">
                  {{currentMusic.musicData.title}}
              </div>
          </div>
          <i class="fa-solid fa-volume-off"></i>
      </div>
      <div class="playerController-playmenu-container">
          <i class="fa-solid fa-repeat"></i>
          <i class="fa-solid fa-backward-step" @click="()=> { FETCH_BEFOREMUSIC(); moveMusic() }"></i>
          <i v-bind:class="[ playButton ? 'fa-solid fa-grip-lines-vertical' : 'fa-solid fa-play' ]" @click="playMusicEnvt"></i>
          <i class="fa-solid fa-forward-step" @click="()=>{ FETCH_NEXTMUSIC(); moveMusic() }"></i>
          <i class="fa-solid fa-shuffle"></i>
      </div>
  </div>
</template>

<script>
import testMusic from '../assets/Music/YourIntroAudionautix.mp3'
import { mapGetters, mapActions } from 'vuex'
import { makeMusicTime } from '../lib/index'
import bus from '../util/bus.js'
// import myMusic from '../assets/Music/Pray-AnnoDominiBeats.mp3'
export default {
    computed: {
        ...mapGetters(['currentMusic', 'baseList'])
    },
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
            ],
            currentMusicTime: 0
        }
    },
    mounted () {
        this.ctx = this.$refs.playerControllerPlaybarCanvasRef.getContext('2d')
    },
    created () {
        bus.$on('moveMusic', this.moveMusic)
    },
    methods: {
        ...mapActions([
            'FETCH_NEXTMUSIC',
            'FETCH_BEFOREMUSIC'
        ]),
        makeMusicTimeFuc (time) {
            return makeMusicTime(time)
        },
        moveMusic () {
            this.currentMusicTime = 0
            console.log('stop')
            this.ctx.clearRect(0, 0, 400, 100)
            this.playButton = false
            clearInterval(this.playingMusic)
            clearTimeout(this.playEndMusic)
            this.playMusicEnvt()
        },
        playMusicEnvt () {
            const loadMusic = this.$refs.audioRef
            console.log('재생')
            console.log('duration', loadMusic.duration)
            console.log('currentTime', loadMusic.currentTime)
            this.playButton = !this.playButton
            if (this.playButton) { // 노래가 로드 끝나면 실행되는것으로 변경
                loadMusic.play()
                const upGauge = 400 / this.currentMusic.musicData.replaytime
                console.log('upgauge', upGauge)
                this.playingMusic = setInterval(() => {
                    console.log('currentTime', this.currentMusicTime)
                    this.ctx.fillStyle = 'green'
                    this.playbarGauge = this.currentMusicTime * upGauge
                    this.ctx.fillRect(0, 0, this.playbarGauge, 100)
                    console.log('gautge', this.playbarGauge)
                    this.currentMusicTime = this.currentMusicTime + 0.1
                }, 100)
                this.playEndMusic = setTimeout(() => {
                    clearInterval(this.playingMusic)
                    this.ctx.clearRect(0, 0, 400, 100)
                    this.playButton = false
                    this.currentMusicTime = 0
                    this.FETCH_NEXTMUSIC()
                    if (this.baseList.length !== 0) {
                        this.playMusicEnvt()
                    } else {
                        this.currentMusicTime = 0
                    }
                }, (this.currentMusic.musicData.replaytime - this.currentMusicTime) * 1000 + 300)
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
.playerController-img-img{
    width: 36%;
    margin-left: 32%;
    margin-top: 5%;
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
    width: 100%;
    height: 40px;
    background-color: burlywood;
    display: flex;
}
.playerContoller-playbar-time{
    float: right;
    font-size: 20px;
    background-color: rgb(185, 185, 207);
}
.playerController-playbar-data-musicData-container{
    width: 90%;
    height: 100%;
    margin-left: 3px;
    background-color: violet;
}
.playerController-playbar-data-musicData-artist{
    width: 100%;
    height: 50%;
    background-color: wheat;
}
.playerController-playbar-data-musicData-music{
    width: 100%;
    height: 50%;
    background-color: rgb(186, 139, 53);
}
.fa-solid.fa-volume-off{
    font-size: 20px;
    width: 10%;
    text-align: center;
    line-height: 2;
    background-color: yellow;
}
</style>
