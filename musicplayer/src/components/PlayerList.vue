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
      <div class="playerList-list-sidemenu-makePlayList">
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
            <li v-for="(data, index) in baseList" :key="index" class="playerList-list-mylist-list-lists">
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
          <div v-if=!menuOffset class="playerList-list-mylist-list-playList">
            플레이리스트
          </div>
        </transition>
      </div>
      <div class="playerList-list-mylist-modal-container">
        모달
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import bus from '../util/bus.js'

export default {
    computed: {
        ...mapGetters(['baseList'])
    },
    created () {
        this.testDatas = this.baseList
    },
    data () {
        return {
            menuOffset: true,
            searchOffset: false,
            testDatas: null,
            menuOffsetStyle: {
                true: {
                    backgroundColor: '#111111',
                    color: 'rgb(217, 215, 213)'
                },
                false: {
                    backgroundColor: '#242424',
                    color: 'rgb(192, 191, 189)'
                }
            }
        }
    },
    methods: {
        ...mapMutations(['SET_CURRENTMUSIC', 'REMOVE_INDEX']),
        listClick (data) {
            this.SET_CURRENTMUSIC(data)
            bus.$emit('moveMusic')
        },
        makeArr (data) {
            console.log('ddd')
            const arr = [`${data}`]
            this.REMOVE_INDEX(arr)
        }
    }
}

</script>

<style>
.playerList-container{
  width: 100%;
  height: 200px;
  background-color: rgb(44, 42, 165);
}
.playerList-list-menu-container{
  width: 100%;
  height: 35px;
  background-color: cadetblue;
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
  background-color: darkgreen;
}
.playerList-list-mylist-list-container{
  width: 100%;
  height: 200px;
  background-color: chartreuse;
}
.playerList-list-mylist-modal-container{
  width: 100%;
  height: 100px;
  background-color: rgb(167, 167, 167);
}
.playerList-list-menu-base{
  width: 50%;
  height: 100%;
  background-color: aqua;
  font-size: 13px;
  text-align: center;
  line-height: 2.5;
  cursor: pointer;
}
.playerList-list-menu-playlist{
  width: 50%;
  height: 100%;
  background-color: rgb(41, 157, 81);
  font-size: 13px;
  text-align: center;
  line-height: 2.5;
  cursor: pointer;

}
.fade-enter-active  {
  transition: opacity .5s;
}
.fade-leave-active {
  display: none;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.playerList-list-mylist-list-playList{
  background-color: rgb(167, 167, 167);
}
.playerList-list-mylist-list-nowPlayList{
  background-color: #111111;
  height: 200px;
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
  background-color: #111111;
  font-size: 12px;
}
.playList-list-mylist-list-list-title{
  background-color: #111111;
  display: block;
  font-size: 14px;
  margin-top: 5px;
}
.playList-list-mylist-list-datas{
  width: 305px;
  background-color: #111111;
  margin-left: 10px;
  color: rgb(167, 167, 167);

}
.playerList-list-sidememu-order{
  display: inline;
  background-color: antiquewhite;
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
</style>
