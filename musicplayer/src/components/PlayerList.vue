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
      <transition-group name="fadeList">
      <div v-if="menuOffset && currentListOffset" key="firstDiv" class="playserList-list-allCheck-Option" @click="allCheckBtn">
        {{allCheckOffsetCurrent}}전체선택
      </div>
      <div v-if="!menuOffset && playListDetail && playListOffset" key="secondDiv" class="playserList-list-allCheck-Option" @click="allCheckBtn">
        {{allCheckOffsetPlaylist}}전체선택
      </div>
      <div v-if="!menuOffset && !playListDetail && playListOffset" key="third" class="playserList-list-allCheck-Option" @click="allCheckBtn">
        {{allCheckOffsetAllPlaylist}}전체선택
      </div>
      </transition-group>
      <div class="playerList-list-sidemenu-makePlayList" :style="menuOffset === true ?currentListOffset === true ? {color: 'rgb(240, 74, 74)'} : '' : playListOffset === true ? {color: 'rgb(240, 74, 74)'} : ''" @click="clickPlus">
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
          <div v-if="menuOffset" class="playerList-list-mylist-list-nowPlayList">
            <PlayerListList listName="baselist" @fromChild="fromChild" @checkAllEvnt="checkAllEvnt" @renderOffsetChange="renderOffsetChange" :fromRenderOffset="renderOffset" :currentListOffset="currentListOffset" ></PlayerListList>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="!menuOffset && !playListDetail" class="playerList-list-mylist-list-nowPlayList">
              <div class="playerList-list-mylist-list-fromlistAdd" @click="fromListAdd"> + 새로운 플레이리스트 생성</div>
              <div v-if="fromListmakePlstlistTitleOffset" class="playerList-list-mylist-fromList-makeNewList-title">
                <input v-model="fromNewListTitle" class="playerList-list-mylist-fromList-makeNewList-title-input"/>
                <div class="playerList-list-mylist-modal-makeNewList-title-add" ><i class="fa-solid fa-circle-check" @click="setListEvnt('fromList')"></i></div>
                <div class="playerList-list-mylist-modal-makeNewList-title-close"><i class="fa-solid fa-circle-xmark" @click="()=> {fromListmakePlstlistTitleOffset = !fromListmakePlstlistTitleOffset}"></i></div>
            </div>
            <li v-for="(data, index) in allPlayList" :key="index" class="playerList-list-mylist-list-playlist" >
               <div v-if="playListOffset" class="playerList-list-mylist-list-checkbox-container"  >
                    <input type="checkbox" :value="renderOffset" class="playerList-list-mylist-check" id="player-checkbox"/>
                    <label class="playerList-list-mylist-label" :class="{clickLabel:checkAllList.has(data[0])}" for="player-checkbox" @click="checkEvnt(data)">✔</label>
                </div>
                <div class="playerList-list-mylist-list-click-container" :class="{widthControl:playListOffset}" >
                    <div class="playerList-list-mylist-list-nowPlayList-img-container" @click="() => {SET_CURRENTOPENID(data[0]); playListDetail = true}">
                        <img v-for="(img, index) in getImgs(data[1])" :key="index" :src="img" class="plyerList-list-mylist-list-nowPlayList-img-1">
                    </div>
                    <div class="playerList-list-mylist-list-content" @click="() => {SET_CURRENTOPENID(data[0]); playListDetail = true}">
                        <div class="playerList-list-mylist-list-content-title">
                        {{data[1].title}}
                        </div>
                        <div class="playerList-list-mylist-list-content-count">
                        노래 {{data[1].data === undefined ? 0 : data[1].data.size}} 곡
                        </div>
                    </div>
                    <div class="playList-list-mylist-list-remove-container" @click="makeArr(data[0])">
                        <i class="fa-solid fa-x"></i>
                    </div>
              </div>
            </li>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="!menuOffset && playListDetail" class="playerList-list-mylist-list-nowPlayList">
            <div class="playerList-list-mylist-list-nowPlayList-allmenu">
              <div class="playerList-list-mylist-list-nowPlayList-menu" @click="returnToPlaylist"> <i class="fa-solid fa-arrow-left"></i> </div>
              <div class="playerList-list-mylist-list-nowPlayList-play" @click="playPlayList"><i class="fa-solid fa-caret-right"></i> 전체 재생</div>
              <div class="playerList-list-mylist-list-nowPlayList-shuffle" @click="playPlayListShuffle"><i class="fa-solid fa-shuffle"></i> 랜덤 재생</div>
            </div>
              <PlayerListList listName="playlist" @fromChild="fromChild" @checkAllEvnt="checkAllEvnt" @renderOffsetChange="renderOffsetChange" :fromRenderOffset="renderOffset" :currentListOffset="playListOffset" ></PlayerListList>
          </div>
        </transition>
      </div>
      <transition name="fadeModal">
      <div class="playerList-list-mylist-modal-container" v-if="menuOffset ? currentListOffset : playListOffset">
        <transition name=fadeList>
        <div class="playerList-list-mylist-modal-base">
          <i v-if="menuOffset" class="fa-solid fa-plus" @click="()=> {makePlaylistOffset = !makePlaylistOffset}"></i>
          <i class="fa-solid fa-trash-can" @click="deleteEvnt"></i>
        </div>
        </transition>
      </div>
      </transition>
    </div>
    <transition name=fadeList>
        <div v-if="makePlaylistOffset && currentListOffset" class="playerList-list-mylist-makePlaylist">
          <div class="playerList-list-mylist-modal-makeNewList-back" ><i class="fa-solid fa-x" @click="makePlaylistOffset = !makePlaylistOffset"></i></div>
          <div v-if="!makePlstlistTitleOffset" class="playerList-list-mylist-modal-makeNewList" @click="()=> {makePlstlistTitleOffset = !makePlstlistTitleOffset}"> + 새로운 리스트 생성</div>
          <div v-if="makePlstlistTitleOffset" class="playerList-list-mylist-modal-makeNewList-title">
            <input v-model="newListTitle" class="playerList-list-mylist-modal-makeNewList-title-input"/>
            <div class="playerList-list-mylist-modal-makeNewList-title-add" ><i class="fa-solid fa-circle-check" @click="setListEvnt('fromModal')"></i></div>
            <div class="playerList-list-mylist-modal-makeNewList-title-close"><i class="fa-solid fa-circle-xmark" @click="()=> {makePlstlistTitleOffset = !makePlstlistTitleOffset}"></i></div>
          </div>
          <div class="playerList-list-mylist-modal-makeNewList-lists">
            <li v-for="(data, index) in allPlayList" @click="setListToMusic(data[0])" :key="index" class="playerList-list-mylist-modal-makeNewList-lists-li">
              {{data[1].title}}
            </li>
          </div>
        </div>
        </transition>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import PlayerListList from './PlayerList-list.vue'

export default {
    computed: {
        ...mapGetters(['baseList', 'currentMusic', 'checkList', 'allPlayListIdList', 'allPlayList', 'currentOpenId', 'checkListPlayList', 'checkAllList'])
    },
    components: {
        PlayerListList
    },
    created () {
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
            fromListmakePlstlistTitleOffset: false,
            allCheckOffsetCurrent: '☐',
            allCheckOffsetPlaylist: '☐',
            allCheckOffsetAllPlaylist: '☐',
            playListCheckValue: false,
            newListTitle: '',
            fromNewListTitle: '',
            renderOffset: false,
            playListDetail: false,
            playListCurrent: [],
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
        ...mapMutations(['SET_CURRENTMUSIC', 'REMOVE_INDEX', 'SET_CHECKLIST_ADD', 'REMOVE_CHECKLIST_INDEX', 'SET_CHECKLIST_CLEAR', 'SET_PLAYLIST_NEWLIST', 'SET_PLAYLIST_ADD', 'SET_CURRENTOPENID', 'SET_CHECKLIST_PLAYLIST_CLEAR', 'SET_CHECKLIST_PLAYLIST_ADD', 'REMOVE_PLAYLIST_INDEX', 'REMOVE_ALLCHECKLIST_INDEX', 'SET_ALLCHECKLIST_PLAYLIST_ADD', 'REMOVE_ALLPLAYLIST_INDEX', 'REMOVE_ALLPLAYLIST_CHECKLIST_INDEX', 'SET_CHECKLIST_ALLPLAYLIST_CLEAR', 'CHANGE_BASELIST_INIT', 'FETCH_RANDOMMUSIC_LIST', 'CHANGE_BASELIST_RANDOM_INIT']),
        ...mapActions(['FETCH_RANDOMMUSIC']),
        renderOffsetChange () {
            if (this.renderOffset) {
                this.renderOffset = false
            } else {
                this.renderOffset = true
            }
        },
        makeArr (data) {
            console.log('data', data)
            const obj = new Map()
            console.log('makeass', obj)
            obj.set(data, true)
            this.REMOVE_ALLPLAYLIST_CHECKLIST_INDEX(obj)
            this.renderOffsetChange()
        },
        checkEvnt (data) {
            // this.$emit('fromChild')
            console.log('data', data[0])
            if (this.checkAllList.has(data[0])) {
                this.REMOVE_ALLPLAYLIST_INDEX(data[0])
            } else {
                this.SET_ALLCHECKLIST_PLAYLIST_ADD(data[0])
            }
            this.checkAllEvnt()
            this.renderOffsetChange()
        },
        setListEvnt (text) {
            if (text === 'fromModal') {
                if (this.newListTitle.length === 0) {
                    alert('텍스트를 입력해주세요.')
                } else {
                    this.SET_PLAYLIST_NEWLIST(this.newListTitle)
                    this.newListTitle = ''
                    this.makePlstlistTitleOffset = !this.makePlstlistTitleOffset
                }
            } else {
                if (this.fromNewListTitle.length === 0) {
                    alert('텍스트를 입력해주세요.')
                } else {
                    this.SET_PLAYLIST_NEWLIST(this.fromNewListTitle)
                    this.fromNewListTitle = ''
                    this.fromListmakePlstlistTitleOffset = !this.fromListmakePlstlistTitleOffset
                }
            }
        },
        setListToMusic (data) {
            if (this.checkList.size > 0) {
                this.SET_PLAYLIST_ADD(data)
                this.renderOffsetChange()
                this.allCheckOffsetCurrent = '☐'
            }
        },
        deleteEvnt () {
            if (this.menuOffset) {
                this.REMOVE_INDEX(this.checkList)
                this.allCheckOffsetCurrent = '☐'
            } else if (this.playListDetail) {
                this.REMOVE_PLAYLIST_INDEX(this.checkListPlayList)
                this.renderOffsetChange()
                this.allCheckOffsetPlaylist = '☐'
            } else {
                this.REMOVE_ALLPLAYLIST_CHECKLIST_INDEX(this.checkAllList)
                this.renderOffsetChange()
                this.allCheckOffsetAllPlaylist = '☐'
            }
        },
        clickPlus () {
            if (this.menuOffset) {
                this.currentListOffset = !this.currentListOffset
            } else {
                this.playListOffset = !this.playListOffset
            }
        },
        checkAllEvnt (name) {
            if (name === 'baselist') {
                if (this.checkList.size === 0) {
                    this.allCheckOffsetCurrent = '☐'
                } else if (this.checkList.size === this.baseList.length) {
                    this.allCheckOffsetCurrent = '☑'
                } else {
                    this.allCheckOffsetCurrent = '☐'
                }
            } else if (name === 'playlist') {
                if (this.checkListPlayList.size === 0) {
                    this.allCheckOffsetPlaylist = '☐'
                } else if (this.checkListPlayList.size === this.allPlayList.get(this.currentOpenId).data.size) {
                    this.allCheckOffsetPlaylist = '☑'
                } else {
                    this.allCheckOffsetPlaylist = '☐'
                }
            } else {
                if (this.checkAllList.size === 0) {
                    this.allCheckOffsetAllPlaylist = '☐'
                } else if (this.checkAllList.size === this.allPlayList.size) {
                    this.allCheckOffsetAllPlaylist = '☑'
                } else {
                    this.allCheckOffsetAllPlaylist = '☐'
                }
            }
        },
        allCheckBtn () {
            if (this.menuOffset) {
                if (this.allCheckOffsetCurrent === '☐') {
                    for (const value of this.baseList) {
                        this.SET_CHECKLIST_ADD(value)
                    }
                    this.allCheckOffsetCurrent = '☑'
                } else {
                    this.SET_CHECKLIST_CLEAR()
                    this.allCheckOffsetCurrent = '☐'
                }
            } else if (this.playListDetail) {
                if (this.allCheckOffsetPlaylist === '☐') {
                    const data = this.allPlayList.get(this.currentOpenId)
                    // eslint-disable-next-line no-unused-vars
                    for (let [key, value] of data.data.entries()) {
                        this.SET_CHECKLIST_PLAYLIST_ADD(value)
                    }
                    this.allCheckOffsetPlaylist = '☑'
                } else {
                    this.SET_CHECKLIST_PLAYLIST_CLEAR()
                    this.allCheckOffsetPlaylist = '☐'
                }
            } else {
                if (this.allCheckOffsetAllPlaylist === '☐') {
                    // eslint-disable-next-line no-unused-vars
                    for (let [key, value] of this.allPlayList.entries()) {
                        this.SET_ALLCHECKLIST_PLAYLIST_ADD(key)
                    }
                    this.allCheckOffsetAllPlaylist = '☑'
                } else {
                    this.SET_CHECKLIST_ALLPLAYLIST_CLEAR()
                    this.allCheckOffsetAllPlaylist = '☐'
                }
            }
            this.renderOffsetChange()
        },
        getImgs (data) {
            const arr = []
            if (data.data === undefined) return
            // eslint-disable-next-line no-unused-vars
            for (let [key, value] of data.data.entries()) {
                arr.push(value.thumbnail)
                if (arr.length === 4) return arr
            }
            return arr
        },
        fromChild () {
            this.renderOffsetChange()
            if (this.checkList.size === this.baseList.length) {
                this.allCheckOffsetCurrent = '☑'
            } else {
                this.allCheckOffsetCurrent = '☐'
            }
        },
        intoPlayListDetail (data) {
            const arr = []
            if (data.data === undefined) return
            // eslint-disable-next-line no-unused-vars
            for (let [key, value] of data.data.entries()) {
                arr.push(value)
            }
            this.playListCurrent = arr
        },
        returnToPlaylist () {
            this.playListDetail = false
        },
        fromListAdd () {
            this.fromListmakePlstlistTitleOffset = !this.fromListmakePlstlistTitleOffset
        },
        playPlayList () {
            if (this.allPlayList.get(this.currentOpenId).data === undefined || this.allPlayList.get(this.currentOpenId).data.size === 0) return
            this.CHANGE_BASELIST_INIT()
            this.$emit('fromListToController')
        },
        playPlayListShuffle () {
            if (this.allPlayList.get(this.currentOpenId).data === undefined || this.allPlayList.get(this.currentOpenId).data.size === 0) return
            this.CHANGE_BASELIST_RANDOM_INIT()
            this.$emit('fromListToController')
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
  height: 280px;
  background-color: #242424;
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
  width: 300px;
  height: 250px;
  border-radius: 13px;
  background-color: #242424;
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
.playerList-list-mylist-list-playlist{
  background-color: #111111;
  /* display: flex; */
  height: 50px;
  width: 400px;

  color: aliceblue;
  list-style: none;
  border-bottom: 1px solid rgb(108, 108, 108);
  display: flex;
  cursor: pointer;
}
.playerList-list-mylist-list-playlist:hover{
    opacity: 0.5;
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
    /* background: #c21e1e; */
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

.playerList-list-mylist-list-content{
  color: rgb(167, 167, 167);
  width: 305px;
  /* margin-left: 10px; */
  padding-left: 5px;
}
.playerList-list-mylist-list-content-title{
  font-size: 16px;
  margin-top: 3px;
}
.playerList-list-mylist-list-content-count{
  font-size: 13px;
}
.playerList-list-mylist-modal-makeNewList-lists{
  margin-top: 7px;
  width: 90%;
  margin-left: 5%;
  height: 155px;
  font-size: 20px;
  overflow-y: scroll;
}
.playerList-list-mylist-modal-makeNewList-lists-li{
  list-style: none;
  border-bottom: 0.5px solid rgb(167, 167, 167);
  cursor: pointer;
}
.playerList-list-mylist-list-nowPlayList-img-container{
  width: 51.17px;
  height: 50px;
  color: antiquewhite;
  display: flex;
  flex-wrap: wrap;
  background-color: #242424;
  padding: 0;
}
.playerList-list-mylist-list-nowPlayList-img-container>img {
  width: 22px;
  height: 25px;
  margin: 0px;
  padding: 0;
}
.playerList-list-mylist-list-nowPlayList-allmenu{
  width: 378px;
  /* background-color: aqua; */
  display: flex;
  padding-left: 5px;
  padding-bottom: 5px;
}
.playerList-list-mylist-list-nowPlayList-menu{
    color: antiquewhite;
    /* background-color: red; */
    /* width: px; */
    padding: 5px;
    font-size: 24px;
    cursor: pointer;
}
.playerList-list-mylist-list-nowPlayList-play{
  width: 85px;
  margin-left: 52px;
  margin-top: 5px;
  height: 35px;
  text-align: center;
  line-height: 2;
  color: rgb(227, 223, 223);
  font-size: 16px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 10px 10px 10px 10px;
  background-color: rgb(240, 74, 74);
  cursor: pointer;
}
.playerList-list-mylist-list-nowPlayList-shuffle{
  width: 92px;
  margin-left: 20px;
  margin-top: 5px;
  height: 35px;
  text-align: center;
  line-height: 2;
  color: rgb(227, 223, 223);
  font-size: 16px;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 10px 10px 10px 10px;
  background-color: rgb(61, 59, 59);
  cursor: pointer;
}
.playerList-list-mylist-list-nowPlayList-menu:hover, .playerList-list-mylist-list-nowPlayList-shuffle:hover, .playerList-list-mylist-list-nowPlayList-play:hover{
  opacity: 0.5;
}
.playerList-list-mylist-modal-makeNewList-back{
  margin-top: 10px;
  width: 95%;
  font-size: 20px;
  display: flex;
  margin-bottom: 5px;
  justify-content: right;
}
.playerList-list-mylist-modal-makeNewList{
  font-size: 15px;
  padding: 5px;
  border: 1px solid rgb(108, 108, 108);
  cursor: pointer;
}
.playerList-list-mylist-modal-makeNewList:hover, .playerList-list-mylist-modal-makeNewList-lists-li:hover, .playerList-list-mylist-modal-makeNewList-title-add:hover, .playerList-list-mylist-modal-makeNewList-title-close:hover {
  opacity: 0.5;
}
.playerList-list-mylist-modal-makeNewList-title{
  /* background-color: aqua; */
  display: flex;
}
.playerList-list-mylist-fromList-makeNewList-title{
  background-color: rgb(96, 99, 99);
  width: 95%;
  margin-left: 2.5%;
  display: flex;
  margin-bottom: 5px;
  border-radius: 0 0 5px 5px;
  padding-bottom: 5px;
  padding-top: 5px;
}
.playerList-list-mylist-modal-makeNewList-title>input {
  margin-left: 20px;
  height: 20px;
  width: 200px;
}
.playerList-list-mylist-fromList-makeNewList-title>input {
  margin-left: 80px;
  height: 20px;
  width: 200px;
}
.playerList-list-mylist-modal-makeNewList-title-add{
  color: rgb(18, 111, 20);
}
.playerList-list-mylist-fromList-makeNewList-title-input{}
.playerList-list-mylist-modal-makeNewList-title-close{
  color: #c21e1e;
}
.playerList-list-mylist-modal-makeNewList-title-add, .playerList-list-mylist-modal-makeNewList-title-close{
  font-size: 20px;
  height: 25px;
  margin-left: 5px;
  cursor: pointer;
}
.playerList-list-mylist-list-fromlistAdd{
    width: 95%;
    margin-top: 10px;
    padding-bottom: 7px;
    font-size: 18px;
    margin-left: 2.5%;
    color: rgb(167, 167, 167);
    border-bottom: 1px solid rgb(167, 167, 167);
    cursor: pointer;
}
.playerList-list-mylist-list-fromlistAdd:hover{
    opacity: 0.5;
}
.playerList-list-mylist-list-click-container{
    display: flex;
     width: 384px;
}
.widthControl{
    width: 352px;
}
</style>
