import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
import { SET_CURRNETMUSIC,
    SET_CURRENTMUSIC_INIT,
    SET_CURRNETMUSIC_OBJECT,
    REMOVE_INDEX,
    SET_CHECKLIST_ADD,
    REMOVE_CHECKLIST_INDEX,
    SET_CHECKLIST_CLEAR,
    SET_PLAYLIST_NEWLIST,
    SET_PLAYLIST_ADD,
    SET_CURRENTOPENID,
    REMOVE_PLAYLIST_INDEX,
    REMOVE_CHECKLIST_PLAYLIST_INDEX,
    SET_CHECKLIST_PLAYLIST_ADD,
    SET_CHECKLIST_PLAYLIST_CLEAR,
    REMOVE_ALLPLAYLIST_CHECKLIST_INDEX,
    SET_ALLCHECKLIST_PLAYLIST_ADD,
    REMOVE_ALLPLAYLIST_INDEX,
    SET_CHECKLIST_ALLPLAYLIST_CLEAR,
    CHANGE_BASELIST_INIT,
    FETCH_RANDOMMUSIC_LIST } from './mutation-type'
import { findNextMusic, findBeforeMusic } from '../lib/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        footprintList: {
        },
        // randomList: [],
        allPlayListIdList: [],
        allPlayList: new Map(),
        allPlayListIdIndex: Number(JSON.parse(localStorage.getItem('allPlayListIdIndex'))) || 0,
        currentMusic: {},
        checkList: new Map(),
        currentOpenId: 0,
        checkListPlayList: new Map(),
        checkAllList: new Map()
    },
    getters: {
        baseList (state) {
            return state.baseList
        },
        currentMusic (state) {
            return state.currentMusic
        },
        // randomList (state) {
        //     return state.randomList
        // },
        checkList (state) {
            return state.checkList
        },
        allPlayListIdList (state) {
            return state.allPlayListIdList
        },
        allPlayList (state) {
            return state.allPlayList
        },
        currentOpenId (state) {
            return state.currentOpenId
        },
        checkListPlayList (state) {
            return state.checkListPlayList
        },
        checkAllList (state) {
            return state.checkAllList
        }
    },
    mutations: {
        [CHANGE_BASELIST_INIT]: (state) => {
            const data = state.allPlayList.get(state.currentOpenId).data
            if (!data) return
            const arr = []
            // eslint-disable-next-line no-unused-vars
            for (let [key, value] of data.entries()) {
                arr.push(value)
            }
            state.baseList = arr
            const currentMusicData = {
                musicData: state.baseList[0],
                musicIndex: 0
            }
            state.currentMusic = currentMusicData
        },
        [SET_CURRENTMUSIC_INIT]: (state) => {
            if (JSON.parse(localStorage.getItem('currentMusic'))) {
                state.currentMusic = JSON.parse(localStorage.getItem('currentMusic'))
            } else if (!JSON.parse(localStorage.getItem('currentMusic')) && state.baseList != null) {
                const data = {
                    musicData: state.baseList[0],
                    musicIndex: 0
                }
                state.currentMusic = data
                localStorage.setItem('currentMusic', JSON.stringify(state.currentMusic))
            } else {
                state.currentMusic = null
            }
        },
        [SET_CHECKLIST_ADD]: (state, data) => {
            state.checkList.set(data.id, data)
        },
        [SET_CHECKLIST_PLAYLIST_ADD]: (state, data) => {
            state.checkListPlayList.set(data.id, data)
        },
        [SET_ALLCHECKLIST_PLAYLIST_ADD]: (state, data) => {
            state.checkAllList.set(data, null)
        },
        [SET_CHECKLIST_CLEAR]: (state) => {
            state.checkList.clear()
        },
        [SET_CHECKLIST_PLAYLIST_CLEAR]: (state) => {
            state.checkListPlayList.clear()
        },
        [SET_CHECKLIST_ALLPLAYLIST_CLEAR]: (state) => {
            state.checkAllList.clear()
        },
        [SET_CURRNETMUSIC]: (state, music) => {
            const data = {
                musicData: music,
                musicIndex: state.baseList.findIndex(el => el.title === music.title)
            }
            state.currentMusic = data
            localStorage.setItem('currentMusic', JSON.stringify(state.currentMusic))
        },
        [SET_CURRNETMUSIC_OBJECT]: (state, data) => {
            state.currentMusic = data
            localStorage.setItem('currentMusic', JSON.stringify(state.currentMusic))
        },
        [REMOVE_INDEX]: (state, removeIds) => {
            let removeIndex = 0
            for (let id of removeIds.keys()) {
                removeIndex = state.baseList.findIndex(el => String(el.id) === String(id))
                state.baseList.splice(removeIndex, 1)
                // state.randomList.delete(Number(id))
                state.checkList.delete(Number(id))
            }
            for (const value in state.baseList) {
                state.baseList[value].index = Number(value)
                if (state.baseList[value].id === state.currentMusic.musicData.id) {
                    state.currentMusic.musicIndex = Number(value)
                }
            }
        },
        [REMOVE_PLAYLIST_INDEX]: (state, removeIds) => {
            for (let id of removeIds.keys()) {
                state.allPlayList.get(state.currentOpenId).data.delete(id)
                state.checkListPlayList.delete(id)
            }
        },
        [REMOVE_ALLPLAYLIST_CHECKLIST_INDEX]: (state, removeIds) => {
            for (let id of removeIds.keys()) {
                state.allPlayList.delete(id)
                state.checkAllList.delete(id)
            }
        },
        [REMOVE_CHECKLIST_INDEX]: (state, id) => {
            state.checkList.delete(id)
        },
        [REMOVE_ALLPLAYLIST_INDEX]: (state, id) => {
            state.checkAllList.delete(id)
        },
        [REMOVE_CHECKLIST_PLAYLIST_INDEX]: (state, id) => {
            state.checkListPlayList.delete(id)
        },
        // [SET_MAP_OBJECT]: (state, data) => {
        //     state.randomList = data
        // },
        // [REMOVE_INDEX_RANDOMLIST]: (state, value) => {
        //     state.randomList.delete(value)
        // },
        [SET_PLAYLIST_NEWLIST]: (state, title) => {
            state.allPlayList.set(state.allPlayListIdIndex++, { title })
        },
        [SET_PLAYLIST_ADD]: (state, id) => {
            // state.checkList.set()
            const data = new Map()
            if (state.allPlayList.get(id).data) {
                for (let[key, value] of state.allPlayList.get(id).data.entries()) {
                    data.set(key, value)
                }
            }
            for (let[key, value] of state.checkList.entries()) {
                data.set(key, value)
            }
            state.allPlayList.get(id).data = data
            state.checkList.clear()
        },
        [SET_CURRENTOPENID]: (state, id) => {
            state.currentOpenId = id
        },
        [FETCH_RANDOMMUSIC_LIST] (state) {
            state.baseList.sort(() => Math.random() - 0.5)
            const index = state.baseList.findIndex((el) => el.id === state.currentMusic.musicIndex)
            state.currentMusic.musicIndex = index
        }

    },
    actions: {
        FETCH_NEXTMUSIC ({ commit, state }) {
            const findResult = findNextMusic(state.baseList, state.currentMusic)
            const data = { musicData: state.baseList[findResult] === undefined ? -1 : state.baseList[findResult],
                musicIndex: findResult
            }
            commit(SET_CURRNETMUSIC_OBJECT, data)
        },
        FETCH_BEFOREMUSIC ({ commit, state }) {
            const findResult = findBeforeMusic(state.baseList, state.currentMusic)
            const data = {
                musicData: state.baseList[findResult],
                musicIndex: findResult
            }
            commit(SET_CURRNETMUSIC_OBJECT, data)
        }
        // FETCH_RANDOMMUSIC ({ commit, state }) {
        //     const iterator = state.randomList.keys()
        //     const value = iterator.next().value
        //     const findResult = state.baseList.findIndex(el => el.id === value)
        //     const data = { musicData: state.baseList[findResult],
        //         musicIndex: findResult
        //     }
        //     commit(REMOVE_INDEX_RANDOMLIST, value)
        //     commit(SET_CURRNETMUSIC_OBJECT, data)
        // }
    }
}
)
