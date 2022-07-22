<template>
    <div class="playerList-list-mylist-list-lists-container"  >
        <li v-for="(data, index) in listData()" @drop.prevent="onDrop($event, index, data)" draggable="true"
         @dragenter.prevent
         @dragover.prevent
         @dragstart="startDrag($event, index, data)"
         :key="`${index}${propsChange}`"
         :id="`${data.id}`" class="playerList-list-mylist-list-lists" :class="{currentMusic:data.id === currentMusic.musicData.id}">
            <transition name="fadeList">
                <div v-if="currentListOffset" class="playerList-list-mylist-list-checkbox-container"  >
                    <input type="checkbox" :value="propsChange"  class="playerList-list-mylist-check" id="player-checkbox"/>
                    <label class="playerList-list-mylist-label" :class="{clickLabel: listName === 'baselist' ? checkList.has(data.id) : checkListPlayList.has(data.id) }" for="player-checkbox" @click.self="() => {checkEvnt(data)}">✔</label>
                </div>
            </transition>
            <img :src="(data.thumbnail)" class="playerList-list-mylist-list-lists-img" :class="{currentMusicSpinner:data.id === currentMusic.musicData.id}" @click="listClick(data)"/>
            <div v-if="(data.id === currentMusic.musicData.id) && playButton" class="linespinner-container"><div class="linespinner"></div></div>
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
                <!-- {{propsChange}} -->
            </div>
        </li>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import bus from '../util/bus.js'

export default {
    data () {
        return {
            startDropItem: null,
            onDropItem: null
        }
    },
    computed: {
        ...mapGetters(['baseList', 'currentMusic', 'checkList', 'allPlayListIdList', 'allPlayList', 'currentOpenId', 'checkListPlayList', 'playButton']),
        propsChange: function () {
            return this.fromRenderOffset
        }
    },
    props: ['propsData', 'fromRenderOffset', 'currentListOffset', 'listName'],
    methods: {
        ...mapMutations(['DRAG_PLAYLIST_CHAGE_INIT', 'DRAG_BASELIST_CHANGE_INIT', 'DRAG_BASELIST_REMOVE', 'SET_CURRENTMUSIC', 'REMOVE_INDEX', 'SET_CHECKLIST_ADD', 'REMOVE_CHECKLIST_INDEX', 'SET_CHECKLIST_CLEAR', 'SET_PLAYLIST_NEWLIST', 'SET_PLAYLIST_ADD', 'REMOVE_CHECKLIST_PLAYLIST_INDEX', 'SET_CHECKLIST_PLAYLIST_ADD', 'REMOVE_PLAYLIST_INDEX']),
        onDrop (event, index, data) {
            // console.log('ondrop', this.startDropItem)
            // console.log('ondropData', index)
            console.log('start', event.offsetY)
            let newIndex = Number(index)
            if (event.offsetY >= 45) {
                newIndex = Number(index + 1)
            }
            console.log('newIndex', newIndex)
            if (this.listName === 'baselist') {
                this.DRAG_BASELIST_CHANGE_INIT({ start: this.startDropItem, newIndex })
            } else {
                const arr = new Map()
                const Data = this.allPlayList.get(this.currentOpenId).data
                // console.log('Data', Data)
                const addData = Data.get(this.startDropItem)
                // console.log('addData', addData)
                let cnt = 0
                for (const [key, value] of Data.entries()) {
                    if (Number(key) === Number(addData.id)) {
                        cnt++
                        continue
                    }
                    if (Number(cnt) === Number(index)) {
                        console.log('cnt', value.title)
                        arr.set(addData.id, addData)
                    }
                    console.log('else', value.title)
                    arr.set(key, value)
                    cnt++
                }
                console.log('arr', arr)
                this.DRAG_PLAYLIST_CHAGE_INIT(arr)
                this.$emit('renderOffsetChange')
            }
        },
        startDrag (event, index, data) {
            if (this.listName === 'baselist') {
                // this.startDropItem = this.baseList[index]
                this.startDropItem = index
            } else {
                this.startDropItem = data.id
            }
        },
        listData () {
            if (this.listName === 'baselist') {
                return this.baseList
            } else {
                const data = this.allPlayList.get(Number(this.currentOpenId))
                const arr = []
                if (data === undefined || data.data === undefined) return
                // eslint-disable-next-line no-unused-vars
                for (let [key, value] of data.data.entries()) {
                    arr.push(value)
                }
                return arr
            }
        },
        makeArr (data) {
            const obj = new Map()
            obj.set(data, true)
            // const arr = [`${data}`]
            if (this.listName === 'baselist') {
                this.REMOVE_INDEX(obj)
            } else {
                this.REMOVE_PLAYLIST_INDEX(obj)
                this.$emit('fromChild')
            }
            this.$emit('checkAllEvnt', this.listName)
        },
        listClick (data) {
            this.SET_CURRENTMUSIC(data)
            bus.$emit('moveMusic')
        },
        checkEvnt (data) {
            this.$emit('fromChild')
            console.log('ans')
            if (this.listName === 'baselist') {
                if (this.checkList.has(data.id)) {
                    this.REMOVE_CHECKLIST_INDEX(data.id)
                } else {
                    this.SET_CHECKLIST_ADD(data)
                }
            } else {
                if (this.checkListPlayList.has(data.id)) {
                    this.REMOVE_CHECKLIST_PLAYLIST_INDEX(data.id)
                } else {
                    this.SET_CHECKLIST_PLAYLIST_ADD(data)
                }
            }
            this.$emit('checkAllEvnt', this.listName)
        }
    }
}
</script>

<style>
.currentMusic{
    background-color: #3a3a3a;
}
.currentMusicSpinner {
    z-index: 999;
}
.linespinner-container{
    position: relative;
}
.linespinner {
  width: 7px;
  height: 15px;
  top:18px;
  left: -30px;
  background: rgb(240, 74, 74);
  position: absolute;
  animation: linespinner 1s ease-in-out infinite;
  animation-delay: 0.4s;
  border-radius: 8px;
  z-index: 999;
}
  .linespinner:after, .linespinner:before {
    border-radius: 8px;
    content: '';
    position: absolute;
    width: 5px;
    height: 10px;
    background: rgb(240, 74, 74);
    animation: linespinner 1s ease-in-out infinite;
}
  .linespinner:before {
    right: 15px;
    animation-delay: 0.15s;
}
  .linespinner:after {
    left: 15px;
    animation-delay: 0.6s;
}

@keyframes linespinner {
  0%, 100% {
    background-color: rgb(238, 45, 45);
    box-shadow: 0 0 0 rgb(227, 134, 134), 0 0 0 rgb(240, 74, 74); }
  50% {
    background-color: rgb(240, 74, 74);
    box-shadow: 0 -8px 0 rgb(240, 74, 74), 0 8px 0 rgb(240, 74, 74); } }
</style>
