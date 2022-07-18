<template>
    <div>
        <li v-for="(data, index) in listData()" :key="index" class="playerList-list-mylist-list-lists" :style="data.id === currentMusic.musicData.id ? currnetPlayingMusic : ''">
            <transition name="fadeList">
                <div v-if="currentListOffset" class="playerList-list-mylist-list-checkbox-container"  >
                    <input type="checkbox" :value="fromRenderOffset"  class="playerList-list-mylist-check" id="player-checkbox"/>
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
            </div>
        </li>
        {{listName}}
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import bus from '../util/bus.js'

export default {
    data () {
        return {
            // renderOffset: false
        }
    },
    computed: {
        ...mapGetters(['baseList', 'currentMusic', 'checkList', 'allPlayListIdList', 'allPlayList', 'currentOpenId', 'checkListPlayList']),
        // checkRender: function () {
        //     if (this.checkList.size === this.baseList.length) {
        //         return 'x'
        //     } else return 'o'
        // }
        propsOffset: function () {
            return this.currentListOffset
        }
    },
    props: ['propsData', 'fromRenderOffset', 'currentListOffset', 'currnetPlayingMusic', 'listName'],
    methods: {
        ...mapMutations(['SET_CURRENTMUSIC', 'REMOVE_INDEX', 'SET_CHECKLIST_ADD', 'REMOVE_CHECKLIST_INDEX', 'SET_CHECKLIST_CLEAR', 'SET_PLAYLIST_NEWLIST', 'SET_PLAYLIST_ADD', 'REMOVE_CHECKLIST_PLAYLIST_INDEX', 'SET_CHECKLIST_PLAYLIST_ADD', 'REMOVE_PLAYLIST_INDEX']),
        listData () {
            if (this.listName === 'baselist') {
                return this.baseList
            } else {
                const data = this.allPlayList.get(Number(this.currentOpenId))
                const arr = []
                if (data.data === undefined) return
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
        },
        listClick (data) {
            this.SET_CURRENTMUSIC(data)
            bus.$emit('moveMusic')
        },
        checkEvnt (data) {
            this.$emit('fromChild')
            console.log('ans', this.checkList.has(data.id))
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
        }
        // allCheckBtn () {
        //     // this.$emit('fromChild')
        //     if (this.allCheckOffset === '☐') {
        //         for (const value of this.baseList) {
        //             console.log(value)
        //             this.SET_CHECKLIST_ADD(value)
        //         }
        //         this.allCheckOffset = '☑'
        //     } else {
        //         this.SET_CHECKLIST_CLEAR()
        //         this.allCheckOffset = '☐'
        //     }
        // }
    }
}
</script>

<style>

</style>
