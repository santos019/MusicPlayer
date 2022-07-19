<template>
  <div class="playerController-container">
      <div class="playerController-img-container">
        <img v-if="currentMusic" :src="currentMusic.musicData.thumbnail" class="playerController-img-img">
      </div>
      <div class="playerController-heart-container">
            <i @mouseover="isHovering = true"  @mouseout="isHovering = false" v-bind:class="[ false || isHovering ? 'fa-solid fa-heart' : 'fa-regular fa-heart'  ]"></i>
      </div>
      <div class="playerController-playbar-container">
          <canvas class="playerController-playbar-canvas" width="400" ref="playerControllerPlaybarCanvasRef"
           @mouseup = "dragGaugebarMouseup($event)"
           @mousedown = "dragGaugebarMousedown($event)"
           @mousemove = "dargGaugebarMousemove($event)"
           @mouseout = "dragGaugebarMouseout($event)">
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
          <i class="fa-solid fa-backward-step" @click="()=> { if (baseList.length != 0) { FETCH_BEFOREMUSIC(); moveMusic() }}"></i>
          <i v-bind:class="[ playButton ? 'fa-solid fa-grip-lines-vertical' : 'fa-solid fa-play' ]" @click="playMusicEnvt"></i>
          <i class="fa-solid fa-forward-step" @click="()=>{  if (baseList.length != 0) { FETCH_NEXTMUSIC(); moveMusic() }}"></i>
          <i class="fa-solid fa-shuffle" :style="shuffleImg[shuffleBtn]" @click="()=>{FETCH_RANDOMMUSIC_LIST()}"></i>
      </div>
  </div>
</template>

<script>
import testMusic from '../assets/Music/YourIntroAudionautix.mp3'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { makeMusicTime } from '../lib/index'
import bus from '../util/bus.js'
// import myMusic from '../assets/Music/Pray-AnnoDominiBeats.mp3'
export default {
    computed: {
        ...mapGetters(['currentMusic', 'baseList', 'playButton'])
    },
    data () {
        return {
            isHovering: false, // store.item값으로 수정하기,
            loadMusic: testMusic,
            ctx: null,
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
            dragOffset: false,
            dragX: 0,
            dragY: 0,
            upGauge: 0
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
            'FETCH_RANDOMMUSIC'
        ]),
        ...mapMutations([
            'FETCH_RANDOMMUSIC_LIST',
            'CHANGE_PLAYBUTTON'
        ]),
        dragGaugebarMousedown (event) {
            // console.log('mousedown', event)
            this.dragX = event.offsetX
            this.dragY = event.offsetY
            this.dragOffset = true
            clearTimeout(this.playEndMusic)
            clearInterval(this.playingMusic)
        },
        dragGaugebarMouseout (event) {
            // console.log('mouseout', event)
        },
        dargGaugebarMousemove (event) {
            if (!this.dragOffset) return
            // console.log('mousemove', event)
            this.dragX = event.offsetX
            this.dragY = event.offsetY
            if (this.playbarGauge > this.dragX) {
                this.ctx.clearRect(this.dragX, 0, this.playbarGauge - this.dragX + 1, 100)
            } else {
                this.ctx.fillRect(0, 0, this.dragX, 100)
            }
            this.playbarGauge = this.dragX
        },
        dragGaugebarMouseup (event) {
            this.dragOffset = false
            this.dragX = event.offsetX
            this.drawGaugebarChange()
            if (this.playButton) {
                this.playingMusicEvnt()
                this.playEndMusicEvnt()
            }
        },
        drawGaugebarChange () {
            this.ctx.fillStyle = 'rgb(240, 74, 74)'
            if (this.upGauge === 0) {
                this.upGauge = 400 / this.currentMusic.musicData.replaytime
            }
            if (this.playbarGauge > this.dragX) {
                console.log('playbar>this.x')
                this.ctx.clearRect(this.dragX, 0, this.playbarGauge - this.dragX + 1, 100)
            } else {
                this.ctx.fillRect(0, 0, this.dragX, 100)
            }
            this.playbarGauge = this.dragX
            this.currentMusicTime = this.playbarGauge / this.upGauge
            // clearTimeout(this.playEndMusic)
        },
        rotateClickEvnt () {
            if (this.rotateBtn === 'first') {
                this.rotateBtn = 'second'
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
            this.CHANGE_PLAYBUTTON(false)
            // this.playButton = false
            clearInterval(this.playingMusic)
            clearTimeout(this.playEndMusic)
            this.playMusicEnvt()
        },
        playMusicEnvt () {
            // const loadMusic = this.$refs.audioRef
            // console.log('재생')
            // console.log('duration', loadMusic.duration)
            // console.log('currentTime', loadMusic.currentTime)
            // this.playButton = !this.playButton
            this.CHANGE_PLAYBUTTON(!this.playButton)
            this.upGauge = 400 / this.currentMusic.musicData.replaytime

            if (this.playButton) { // 노래가 로드 끝나면 실행되는것으로 변경
                // loadMusic.play()
                this.playingMusicEvnt()
                this.playEndMusicEvnt()
            } else {
                console.log('정지')
                // loadMusic.pause()
                clearInterval(this.playingMusic)
                clearTimeout(this.playEndMusic)
            }
            // if (loadMusic.currentTime === 0) {
            //     this.ctx.clearRect(0, 0, 400, 100)
            // }
        },
        playingMusicEvnt () {
            this.playingMusic = setInterval(() => {
                this.ctx.fillStyle = 'rgb(240, 74, 74)'
                this.playbarGauge = this.currentMusicTime * this.upGauge
                this.ctx.fillRect(0, 0, this.playbarGauge, 100)
                this.currentMusicTime = this.currentMusicTime + 0.1
            }, 100)
        },
        playEndMusicEvnt () {
            this.playEndMusic = setTimeout(() => {
                clearInterval(this.playingMusic)
                this.ctx.clearRect(0, 0, 400, 100)
                // this.playButton = false
                this.CHANGE_PLAYBUTTON(false)
                this.currentMusicTime = 0
                if (this.rotateBtn === 'first') {
                    if (Number(this.currentMusic.musicIndex) >= this.baseList.length - 1) {
                        this.currentMusicTime = 0
                    } else {
                        this.FETCH_NEXTMUSIC()
                        this.playMusicEnvt()
                    }
                } else if (this.rotateBtn === 'second') {
                    this.FETCH_NEXTMUSIC()
                    this.playMusicEnvt()
                } else {
                    this.playMusicEnvt()
                }
            }, (this.currentMusic.musicData.replaytime - this.currentMusicTime) * 1000 + 300)
        },
        initPlayMusic () {
            // this.playButton = false
            this.CHANGE_PLAYBUTTON(false)
            this.currentMusicTime = 0
            this.ctx.clearRect(0, 0, 400, 100)
            clearInterval(this.playingMusic)
            clearTimeout(this.playEndMusic)
            this.playMusicEnvt()
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
.playerController-playbar-canvas:hover{
    height: 18px;
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
    margin-bottom: 20px;
}
.playerController-playbar-data-container{
    width: 100%;
    height: 40px;
    background-color: #242424;
    display: flex;
}
.playerContoller-playbar-time{
    float: right;
    width: 20%;
    font-size: 14px;
    text-align: center;
    line-height: 1.5;
    margin-left: 40px;
    background-color: #242424;
    color: rgb(205, 205, 205);
}
.playerController-playbar-data-musicData-container{
    width: 70%;
    height: 100%;
    margin-left: 3px;
    margin-top: 5px;
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
    line-height: 1.6;
    margin-right: 5px;
    background-color: #242424;
    color: rgb(205, 205, 205);
}
</style>
