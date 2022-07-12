<template>
  <div class="playerList-list-container">
    <div class="playerList-list-menu-container">
        <div class="playerList-list-menu-base" @click="()=> {menuOffset = true}">
          현재 재생 리스트
        </div>
         <div class="playerList-list-menu-playlist" @click="()=> {menuOffset = false}">
          플레이리스트
        </div>
    </div>
    <div class="playerList-list-sidmenu-container">
      리스트순
    </div>
    <div class="playerList-list-mylist-container">
      <div class="playerList-list-mylist-list-container">
        <transition name="fade">
          <div v-if=menuOffset class="playerList-list-mylist-list-nowPlayList">
            <li v-for="(data, index) in baseList" :key="index" class="playerList-list-mylist-list-lists">
              <img :src="(data.thumbnail)" class="playerList-list-mylist-list-lists-img"/>
              <div class="playList-list-mylist-list-datas">
                <div class="playList-list-mylist-list-list-artist">
                  {{ data.artist }}
                </div>
                <div class="playList-list-mylist-list-list-title">
                  {{ data.title }}
                </div>
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
import { mapGetters } from 'vuex'
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
            testDatas: null
        }
    },
    methods: {
        makeImg (url) {
            return ('@' + url)
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
  background-color: chocolate;
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
  background-color: darkmagenta;
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
  background-color: aqua;
}
.playerList-list-mylist-list-nowPlayList{
  background-color: rgb(179, 179, 230);
  height: 200px;
  overflow-y: auto;
}
.playerList-list-mylist-list-lists{
  border-bottom: 1px solid black;
  list-style: none;
  flex-direction: row;
  display: flex;
}
.playerList-list-mylist-list-lists-img{
  width: 50px;
  display: flex;
}
.playList-list-mylist-list-list-artist{
  display: block;
  background-color: aqua;
}
.playList-list-mylist-list-list-title{
  background-color: blue;
  display: block;
}
.playList-list-mylist-list-datas{
  width: 350px;
  background-color: beige;

}
</style>
