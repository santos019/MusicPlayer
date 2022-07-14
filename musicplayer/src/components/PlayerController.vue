<template>
  <div class="playerController-container">
      <div class="playerController-img-container">
        <img v-if="currentMusic" :src="currentMusic.musicData.thumbnail" class="playerController-img-img">
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
      </div>
      <div class="playerController-playbar-data-container">
          <div class="playerController-playbar-data-musicData-container" v-if="currentMusic">
              <div class="playerController-playbar-data-musicData-artist">
                  {{currentMusic.musicData.artist}}
              </div>
              <div class="playerController-playbar-data-musicData-music">
                  {{currentMusic.musicData.title}}
              </div>
          </div>
          <div class="playerContoller-playbar-time" v-if="currentMusic">
               {{makeMusicTimeFuc(Math.floor(currentMusicTime))}}/{{makeMusicTimeFuc(currentMusic.musicData.replaytime || 0)}}
            </div>
            <i class="fa-solid fa-volume-off"></i>
      </div>
      <div class="playerController-playmenu-container">
          <i class="fa-solid fa-repeat" :style="rotateImg[rotateBtn]" @click="() => { rotateClickEvnt() }"></i>
          <!-- <img :src="rotateImg[rotateBtn].img" :style="rotateImg[rotateBtn].style" class="playerController-playermenu-repeat" @click="() => { rotateClickEvnt() }"/> -->
          <i class="fa-solid fa-backward-step" @click="()=> { if (baseList.length != 0) { FETCH_BEFOREMUSIC(); moveMusic() }}"></i>
          <i v-bind:class="[ playButton ? 'fa-solid fa-grip-lines-vertical' : 'fa-solid fa-play' ]" @click="playMusicEnvt"></i>
          <i class="fa-solid fa-forward-step" @click="()=>{  if (baseList.length != 0) { FETCH_NEXTMUSIC(); moveMusic() }}"></i>
          <i class="fa-solid fa-shuffle" :style="shuffleImg[shuffleBtn]" @click="()=>{shuffleBtn = !shuffleBtn}"></i>
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
        ...mapGetters(['currentMusic', 'baseList', 'randomList'])
    },
    data () {
        return {
            isHovering: false, // store.item값으로 수정하기,
            loadMusic: testMusic,
            ctx: null,
            playButton: false,
            playingMusic: null,
            playbarGauge: 0,
            playEndMusic: null,
            currentMusicTime: 0,
            rotateBtn: 'first',
            shuffleBtn: true,
            rotateImg: {
                first: {
                    opacity: 0.5
                },
                second: {
                    color: 'rgb(192, 191, 189)'
                },
                third: {
                    color: 'rgb(240, 74, 74)'
                }
            },
            shuffleImg: {
                true: {
                    opacity: 0.5
                },
                false: {
                    color: 'rgb(192, 191, 189)'
                }
            },
            setOffset: false
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
            'FETCH_BEFOREMUSIC',
            'FETCH_RANDOMMUSIC',
            'FETCH_RANDOMMUSIC_LIST'
        ]),
        rotateClickEvnt () {
            if (this.rotateBtn === 'first') {
                this.rotateBtn = 'second'
                // this.$set(this.rotateShuffleBtn, 0, 'second')
            } else if (this.rotateBtn === 'second') {
                this.rotateBtn = 'third'
            } else {
                this.rotateBtn = 'first'
            }
        },
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
            // console.log('재생')
            // console.log('duration', loadMusic.duration)
            // console.log('currentTime', loadMusic.currentTime)
            this.playButton = !this.playButton
            if (this.playButton) { // 노래가 로드 끝나면 실행되는것으로 변경
                loadMusic.play()
                const upGauge = 400 / this.currentMusic.musicData.replaytime
                // console.log('upgauge', upGauge)
                this.playingMusic = setInterval(() => {
                    // console.log('currentTime', this.currentMusicTime)
                    this.ctx.fillStyle = 'rgb(240, 74, 74)'
                    this.playbarGauge = this.currentMusicTime * upGauge
                    this.ctx.fillRect(0, 0, this.playbarGauge, 100)
                    // console.log('gautge', this.playbarGauge)
                    this.currentMusicTime = this.currentMusicTime + 0.1
                }, 100)
                this.playEndMusic = setTimeout(() => {
                    clearInterval(this.playingMusic)
                    this.ctx.clearRect(0, 0, 400, 100)
                    this.playButton = false
                    this.currentMusicTime = 0
                    console.log('this.randomList.size', this.randomList.size)
                    if (this.setOffset === true) {
                        this.FETCH_RANDOMMUSIC_LIST()
                        this.playMusicEnvt()
                        console.log(0)
                        this.setOffset = false
                    } else if (this.rotateBtn === 'first' && this.shuffleBtn === false && this.randomList.size !== 0) {
                        this.FETCH_RANDOMMUSIC()
                        this.playMusicEnvt()
                        console.log('1')
                    } else if (this.rotateBtn === 'first' && this.shuffleBtn === false && this.randomList.size === 0) {
                        this.currentMusicTime = 0
                        this.shuffleBtn = true
                        this.setOffset = true
                        console.log('2')
                    } else if (this.rotateBtn === 'second' && this.shuffleBtn === false && this.randomList.size === 0) {
                        this.FETCH_RANDOMMUSIC_LIST()
                        this.playMusicEnvt()
                        console.log('3')
                    } else if (this.rotateBtn === 'third') {
                        this.currentMusicTime = 0
                        this.playMusicEnvt()
                        console.log('4')
                    } else if ((this.rotateBtn === 'second' || (this.currentMusic.musicIndex !== this.baseList.length - 1)) && this.baseList.length !== 0) {
                        this.FETCH_NEXTMUSIC()
                        this.playMusicEnvt()
                        console.log('5')
                    } else {
                        this.currentMusicTime = 0
                        console.log('6')
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
    background-color: #111111;
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
    color: rgb(240, 74, 74);
    background-color: #111111;
}
.playerController-playbar-container{
    width: 100%;
    height: 18px;
    background-color: #242424;
}
.playerController-playmenu-container{
    width: 100%;
    height: auto;
    background-color: #242424;
    display: flex;
    margin-top: 7px;
    justify-content: space-around;
    align-items: center;
}
.playerController-heart-container > i {
    cursor: pointer;
    font-size: 23px;
}
.playerController-playmenu-container > i {
    background-color: #242424;
    font-size: 30px;
    cursor: pointer;
}
.fa-solid.fa-repea{
    /* background-color: aqua; */
    /* opacity: 0.6; */
    width: 30px;
    cursor: pointer;
}
.fa-solid.fa-repea:hover {
    opacity: 1;
}
.playerController-playmenu-container > i:hover {
    color: rgb(192, 191, 189);
}
.playerController-playmenu-container i:nth-child(3) {
    font-size: 38px;
}
.playerController-playbar-canvas{
    width: 400px;
    height: 6px;
    background-color: #000000;
    margin-bottom: 10px;
}
.playerController-playbar-data-container{
    width: 100%;
    height: 30px;
    background-color: #242424;
    display: flex;
}
.playerContoller-playbar-time{
    float: right;
    width: 20%;
    font-size: 14px;
    text-align: center;
    line-height: 0.7;
    margin-left: 40px;
    background-color: #242424;
    color: rgb(205, 205, 205);
}
.playerController-playbar-data-musicData-container{
    width: 70%;
    height: 100%;
    margin-left: 3px;
    background-color: #242424;
    color: rgb(205, 205, 205);
    font-size: 13px;
    line-height: 0.5;
    margin-left: 8px;
}
.playerController-playbar-data-musicData-artist{
    width: 100%;
    height: 50%;
    background-color: #242424;
}
.playerController-playbar-data-musicData-music{
    width: 100%;
    height: 50%;
    background-color: #242424;
}
.fa-solid.fa-volume-off{
    font-size: 15px;
    width: 10%;
    text-align: center;
    line-height: 0.9;
    margin-right: 5px;
    background-color: #242424;
    color: rgb(205, 205, 205);
}
</style>
