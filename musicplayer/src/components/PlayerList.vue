<template>
  <div class="playerList-list-container">
    <div class="playerList-list-menu-container">
        <div class="playerList-list-menu-base" :style="menuOffsetStyle[menuOffset]" @click="()=> {menuOffset = true}">
          현재 재생 리스트
        </div>
         <div class="playerList-list-menu-playlist" :style="menuOffsetStyle[!menuOffset]" @click="()=> {menuOffset = false}">
          플레이리스트
        </div>
    </div>
    <div class="playerList-list-sidmenu-container">
      <div class="playerList-list-sidememu-order">
        리스트순
      </div>
      <transition name="fadeList">
      <div v-if="menuOffset" class="playserList-list-allCheck-Option" @click="allCheckBtn">
        {{allCheckOffset}}전체선택
      </div>
      <div v-else class="playserList-list-allCheck-Option" @click="allCheckBtn">
        {{allCheckOffset}}전체선택2
      </div>
      </transition>
      <div class="playerList-list-sidemenu-makePlayList" :style="menuOffset === true ?currentListOffset === true ? {color: 'rgb(240, 74, 74)'} : '' : playListOffset === true ? {color: 'rgb(240, 74, 74)'} : ''" @click="() => { menuOffset === true ? currentListOffset = !currentListOffset : playListOffset = !playListOffset}">
        <i class="fa-solid fa-plus"></i>
      </div>
      <div class="playerList-list-sidemenu-search" @click="()=> {searchOffset = !searchOffset}">
        <i class="fa-brands fa-sistrix"></i>
      </div>
      <transition name="fade">
       <input v-show="searchOffset" class="playerList-list-sidemenu-search-box"/>
      </transition>
    </div>
    <div class="playerList-list-mylist-container">
      <div class="playerList-list-mylist-list-container">
        <transition name="fade">
          <div v-if=menuOffset class="playerList-list-mylist-list-nowPlayList">
            <li v-for="(data, index) in baseList" :key="index" class="playerList-list-mylist-list-lists" :style="data.id === currentMusic.musicData.id ? currnetPlayingMusic : ''">
              <transition name="fadeList">
                <div v-if="currentListOffset" class="playerList-list-mylist-list-checkbox-container"  @click.self="checkEvnt(data)" >
                    <input v-model="checked[index]" type="checkbox"  class="playerList-list-mylist-check" id="player-checkbox"/>
                    <label class="playerList-list-mylist-label" :class="{clickLabel: checkList.has(data.id)}" for="player-checkbox" @click.self="checkEvnt(data)">✔</label>
                </div>
              </transition>
              <img :src="(data.thumbnail)" class="playerList-list-mylist-list-lists-img"  @click="listClick(data)"/>
              <div class="playList-list-mylist-list-datas"  @click="listClick(data)">
                <div class="playList-list-mylist-list-list-title">
                  {{ data.title }}
                </div>
                <div class="playList-list-mylist-list-list-artist">
                  {{ data.artist }}
                </div>
              </div>
              <div class="playList-list-mylist-list-remove-container" @click="makeArr(data.id)">
                <i class="fa-solid fa-x"></i>
              </div>
            </li>
          </div>
        </transition>
        <transition name="fade">
          <div v-if=!menuOffset class="playerList-list-mylist-list-nowPlayList">
          </div>
        </transition>
        {{testvalue}}
      </div>
      <transition name="fadeModal">
      <div class="playerList-list-mylist-modal-container" v-if="menuOffset ? currentListOffset : playListOffset">
        <transition name=fadeList>
        <div class="playerList-list-mylist-modal-base">
          <i class="fa-solid fa-plus" @click="()=> {makePlaylistOffset = !makePlaylistOffset}"></i>
          <i class="fa-solid fa-trash-can" @click="() => REMOVE_INDEX(checkList)"></i>
        </div>
        </transition>
      </div>
      </transition>
    </div>
    <transition name=fadeList>
        <div v-if="makePlaylistOffset" class="playerList-list-mylist-makePlaylist">
          <div class="playerList-list-mylist-modal-makeNewList-back" @click="makePlaylistOffset = !makePlaylistOffset">돌아가기</div>
          <div v-if="!makePlstlistTitleOffset" class="playerList-list-mylist-modal-makeNewList" @click="()=> {makePlstlistTitleOffset = !makePlstlistTitleOffset}"> + 새로운 리스트 생성</div>
          <div v-if="makePlstlistTitleOffset" class="playerList-list-mylist-modal-makeNewList-title">
            <input class="playerList-list-mylist-modal-makeNewList-title-input"/>
            <div class="playerList-list-mylist-modal-makeNewList-title-add" @click="()=> {}">완료</div>
            <div class="playerList-list-mylist-modal-makeNewList-title-close" @click="()=> {makePlstlistTitleOffset = !makePlstlistTitleOffset}">x</div>
          </div>
        </div>
        </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import bus from '../util/bus.js'

export default {
    computed: {
        ...mapGetters(['baseList', 'currentMusic', 'checkList']),
        checkRender: function () {
            if (this.checkList.size === this.baseList.length) {
                return 'x'
            } else return 'o'
        }
    },
    created () {
        this.testDatas = this.baseList
    },
    data () {
        return {
            menuOffset: true,
            searchOffset: false,
            currentListOffset: false,
            playListOffset: false,
            addListOffset: false,
            makePlaylistOffset: false,
            makePlstlistTitleOffset: false,
            testDatas: null,
            testvalue: null,
            allCheckOffset: '☐',
            playListCheckValue: false,
            menuOffsetStyle: {
                true: {
                    backgroundColor: '#111111',
                    color: 'rgb(217, 215, 213)'
                },
                false: {
                    backgroundColor: '#242424',
                    color: 'rgb(192, 191, 189)'
                }
            },
            currnetPlayingMusic: {
                backgroundColor: '#3a3a3a'
            },
            checked: {}
        }
    },
    methods: {
        ...mapMutations(['SET_CURRENTMUSIC', 'REMOVE_INDEX', 'SET_CHECKLIST_ADD', 'REMOVE_CHECKLIST_INDEX', 'SET_CHECKLIST_CLEAR']),
        listClick (data) {
            this.SET_CURRENTMUSIC(data)
            bus.$emit('moveMusic')
        },
        makeArr (data) {
            const obj = new Map()
            obj.set(data, true)
            // const arr = [`${data}`]
            this.REMOVE_INDEX(obj)
        },
        checkEvnt (data) {
            console.log('ans', this.checkList.has(data.id))
            if (this.checkList.has(data.id)) {
                this.REMOVE_CHECKLIST_INDEX(data.id)
            } else {
                this.SET_CHECKLIST_ADD(data)
            }
            if (this.checkList.size === this.baseList.length) {
                this.allCheckOffset = '☑'
            } else {
                this.allCheckOffset = '☐'
            }
        },
        allCheckBtn () {
            if (this.allCheckOffset === '☐') {
                for (const value of this.baseList) {
                    console.log(value)
                    this.SET_CHECKLIST_ADD(value)
                }
                this.allCheckOffset = '☑'
            } else {
                this.SET_CHECKLIST_CLEAR()
                this.allCheckOffset = '☐'
            }
        }
    }
}

</script>

<style>
.playerList-container{
  width: 100%;
  height: 200px;
}
.playerList-list-menu-container{
  width: 100%;
  height: 35px;
  display: flex;
}
.playerList-list-sidmenu-container{
  width: 100%;
  height: 25px;
  background-color: #111111;
}
.playerList-list-mylist-container{
  width: 100%;
  height: 300px;
}
.playerList-list-mylist-list-container{
  width: 100%;
  /* height: 200px; */
}
.playerList-list-mylist-modal-base{
  width: 100%;
  height: 60px;
  border-radius: 13px;
  background-color: #242424;
  font-size: 25px;
  color: rgb(167, 167, 167);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
.playerList-list-mylist-makePlaylist{
  width: 400px;
  height: 250px;
  border-radius: 13px;
  background-color: #242424;
  font-size: 25px;
  color: rgb(167, 167, 167);
  top: 415px;
  left: 410px;
  position: absolute;
}
.playerList-list-mylist-modal-base>i {
    cursor: pointer;
}
.playerList-list-mylist-modal-base>i:hover{
    color: rgb(240, 74, 74);
}
.playerList-list-menu-base{
  width: 50%;
  height: 100%;
  font-size: 13px;
  text-align: center;
  line-height: 2.5;
  cursor: pointer;
}
.playerList-list-menu-playlist{
  width: 50%;
  height: 100%;
  font-size: 13px;
  text-align: center;
  line-height: 2.5;
  cursor: pointer;

}
.fade-enter-active {
  transition: opacity .5s;
}
.fade-leave-active {
  display: none;
}
.fadeModal-enter-active, .fadeList-enter-active {
    transition: all .3s ease;
}
.fadeModal-leave-active, .fadeList-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeModal-leave-to,  .fadeModal-enter {
    transform: translateY(10px);
    opacity: 0;
}
.fadeList-enter, .fadeList-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}
.fade-enter, .fade-leave-to/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.playerList-list-mylist-list-playList{
  background-color: rgb(167, 167, 167);
}
.playerList-list-mylist-list-nowPlayList{
  background-color: #111111;
  height: 250px;
  overflow-y: auto;
}
.playerList-list-mylist-list-lists{
  border-bottom: 0.5px solid rgb(108, 108, 108);
  list-style: none;
  flex-direction: row;
  display: flex;
  cursor: pointer;
}
.playerList-list-mylist-list-lists:hover{
  opacity: 0.6;
}
.playerList-list-mylist-list-lists-img{
  width: 50px;
  display: flex;
}
.playList-list-mylist-list-list-artist{
  display: block;
  /* background-color: #111111; */
  font-size: 12px;
}
.playList-list-mylist-list-list-title{
  /* background-color: #111111; */
  display: block;
  font-size: 14px;
  margin-top: 5px;
}
.playList-list-mylist-list-datas{
  width: 305px;
  /* background-color: #111111; */
  margin-left: 10px;
  color: rgb(167, 167, 167);

}
.playerList-list-sidememu-order, .playserList-list-allCheck-Option{
  display: inline;
  /* background-color: antiquewhite; */
  color: rgb(167, 167, 167);
  margin-left: 5px;
  font-size: 13px;
}
.playerList-list-sidemenu-search{
  display: inline;
  float: right;
  cursor: pointer;
  color: rgb(167, 167, 167);
  margin-right: 5px;
}
.playerList-list-sidemenu-search:hover{
  color: rgb(201, 195, 195);
}
.playerList-list-sidemenu-makePlayList{
  display: inline;
  float: right;
  cursor: pointer;
  color: rgb(167, 167, 167);
  margin-right: 7px;
}
.playerList-list-sidemenu-makePlayList:hover{
  color: rgb(201, 195, 195);
}
.playerList-list-sidemenu-search-box{
  display: inline;
  background-color: rgb(167, 167, 167);
  float:right;
  margin-right: 5px;
}
.playList-list-mylist-list-remove-container{
  width: auto;
  line-height: 3;
  margin-right: 10px;
  color: rgb(201, 195, 195);
}
input[type="checkbox"]{
    display: none;
}
.playerList-list-mylist-label{
    display: flex;
    width: 25px;
    height: 50px;
    font-size: 0px;
    /* font-weight: 100; */
    margin-left: 7px;
    /* color: rgb(27, 0, 163); */
    line-height: 2;
    cursor: pointer;
}
.clickLabel {
  /* text-align: center; */
    /* display: inline; */
    font-size: 18px;
    font-weight: 300;
    color: rgb(240, 74, 74);
    width: 25px;
    height: 50px;
    line-height: 2.5;
    margin-left: 7px;
    /* position: relative; */
    /* top: -5px; */
    /* background-color: rgb(240, 74, 74); */
}

/* input[id="player-checkbox"]:checked + label::after{
     content: '✔';
    font-size: 15px;
    color: rgb(240, 74, 74);
    width: 13px;
    height: 13px;
    position: absolute;
    top: -5px;
} */

.playerList-list-mylist-list-checkbox-container{
    /* background-color: aliceblue; */
    /* border: 1px solid red; */
}
.playerList-list-mylist-label{
  /* width: 25px; */
  /* background-color: blue; */
}
</style>
