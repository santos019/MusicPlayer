<template>
    <div class="playerList-list-mylist-list-lists-container"  >
        <li v-for="(data, index) in listData()" @drop.prevent="onDrop($event, index, data)" draggable="true"
         @dragenter.prevent
         @dragover.prevent
         @dragstart="startDrag($event, index, data)"
         :key="`${index}${propsChange}`" class="playerList-list-mylist-list-lists" :style="data.id === currentMusic.musicData.id ? currnetPlayingMusic : ''">
            <transition name="fadeList">
                <div v-if="currentListOffset" class="playerList-list-mylist-list-checkbox-container"  >
                    <input type="checkbox" :value="propsChange"  class="playerList-list-mylist-check" id="player-checkbox"/>
                    <label class="playerList-list-mylist-label" :class="{clickLabel: listName === 'baselist' ? checkList.has(data.id) : checkListPlayList.has(data.id) }" for="player-checkbox" @click.self="() => {checkEvnt(data)}">✔</label>
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
        ...mapGetters(['baseList', 'currentMusic', 'checkList', 'allPlayListIdList', 'allPlayList', 'currentOpenId', 'checkListPlayList']),
        propsChange: function () {
            return this.fromRenderOffset
        }
    },
    props: ['propsData', 'fromRenderOffset', 'currentListOffset', 'currnetPlayingMusic', 'listName'],
    methods: {
        ...mapMutations(['DRAG_PLAYLIST_CHAGE_INIT', 'DRAG_BASELIST_CHANGE_INIT', 'DRAG_BASELIST_REMOVE', 'SET_CURRENTMUSIC', 'REMOVE_INDEX', 'SET_CHECKLIST_ADD', 'REMOVE_CHECKLIST_INDEX', 'SET_CHECKLIST_CLEAR', 'SET_PLAYLIST_NEWLIST', 'SET_PLAYLIST_ADD', 'REMOVE_CHECKLIST_PLAYLIST_INDEX', 'SET_CHECKLIST_PLAYLIST_ADD', 'REMOVE_PLAYLIST_INDEX']),
        onDrop (event, index, data) {
            console.log('ondrop', event)
            console.log('ondropData', index)
            if (this.listName === 'baselist') {
                const arr = []
                for (const value in this.baseList) {
                    if (Number(value) === Number(this.startDropItem)) {
                        continue
                    }
                    if (Number(value) === Number(index)) {
                        arr.push(this.baseList[this.startDropItem])
                    }
                    arr.push(this.baseList[value])
                }
                console.log('arr', arr)
                // this.DRAG_BASELIST_REMOVE(this.startDropItem)
                this.DRAG_BASELIST_CHANGE_INIT(arr)
            } else {
                const arr = new Map()
                const Data = this.allPlayList.get(this.currentOpenId).data
                console.log('Data', Data)
                const addData = Data.get(this.startDropItem)
                console.log('addData', addData)
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

</style>
