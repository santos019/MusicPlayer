import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
import { SET_CURRNETMUSIC,
    SET_CURRENTMUSIC_INIT,
    SET_CURRNETMUSIC_OBJECT,
    REMOVE_INDEX,
    SET_MAP_OBJECT,
    REMOVE_INDEX_RANDOMLIST,
    SET_CHECKLIST_ADD,
    REMOVE_CHECKLIST_INDEX,
    SET_CHECKLIST_CLEAR,
    SET_PLAYLIST_NEWLIST,
    SET_PLAYLIST_ADD,
    SET_CURRENTOPENID,
    REMOVE_PLAYLIST_INDEX,
    REMOVE_CHECKLIST_PLAYLIST_INDEX,
    SET_CHECKLIST_PLAYLIST_ADD,
    SET_CHECKLIST_PLAYLIST_CLEAR } from './mutation-type'
import { findNextMucic, findBeforeMusic } from '../lib/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        footprintList: {
        },
        randomList: [],
        allPlayListIdList: [],
        allPlayList: new Map(),
        allPlayListIdIndex: Number(JSON.parse(localStorage.getItem('allPlayListIdIndex'))) || 0,
        currentMusic: {},
        checkList: new Map(),
        currentOpenId: 0,
        checkListPlayList: new Map()
    },
    getters: {
        baseList (state) {
            return state.baseList
        },
        currentMusic (state) {
            return state.currentMusic
        },
        randomList (state) {
            return state.randomList
        },
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
        }
    },
    mutations: {
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
        [SET_CHECKLIST_CLEAR]: (state) => {
            state.checkList.clear()
        },
        [SET_CHECKLIST_PLAYLIST_CLEAR]: (state) => {
            state.checkListPlayList.clear()
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
                console.log('id', id)
                removeIndex = state.baseList.findIndex(el => String(el.id) === String(id))
                state.baseList.splice(removeIndex, 1)
                state.randomList.delete(Number(id))
                state.checkList.delete(Number(id))
            }
            for (const value in state.baseList) {
                state.baseList[value].index = Number(value)
                if (state.baseList[value].id === state.currentMusic.musicData.id) {
                    state.currentMusic.musicIndex = Number(value)
                }
            }
            // removeIds.clear()
        },
        [REMOVE_PLAYLIST_INDEX]: (state, removeIds) => {
            for (let id of removeIds.keys()) {
                console.log('id', id)
                state.allPlayList.get(state.currentOpenId).data.delete(id)
            }
        },
        [REMOVE_CHECKLIST_INDEX]: (state, id) => {
            state.checkList.delete(id)
        },
        [REMOVE_CHECKLIST_PLAYLIST_INDEX]: (state, id) => {
            state.checkListPlayList.delete(id)
        },
        [SET_MAP_OBJECT]: (state, data) => {
            state.randomList = data
        },
        [REMOVE_INDEX_RANDOMLIST]: (state, value) => {
            state.randomList.delete(value)
        },
        [SET_PLAYLIST_NEWLIST]: (state, title) => {
            // const data = {
            //     'id': state.allPlayListIdIndex,
            //     'title': title,
            //     'order': []
            // }
            // console.log(data)
            // state.allPlayListIdList.push(data)
            state.allPlayList.set(state.allPlayListIdIndex++, { title })
        },
        [SET_PLAYLIST_ADD]: (state, id) => {
            // state.checkList.set()
            const data = new Map()
            if (state.allPlayList.get(id).data) {
                for (let[key, value] of state.allPlayList.get(id).data.entries()) {
                    console.log(key + ' : ' + value)
                    data.set(key, value)
                }
            }
            for (let[key, value] of state.checkList.entries()) {
                console.log(key + ' : ' + value)
                data.set(key, value)
            }
            // mapObj.set('test', null)
            // console.log('check', mapObj)
            console.log('data', data)
            state.allPlayList.get(id).data = data
            state.checkList.clear()
            // Vue.set(state.checkList, 0, null)
        },
        [SET_CURRENTOPENID]: (state, id) => {
            state.currentOpenId = id
        }
    },
    actions: {
        FETCH_NEXTMUSIC ({ commit, state }) {
            const findResult = findNextMucic(state.baseList, state.currentMusic)
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
        },
        FETCH_RANDOMMUSIC_LIST ({ commit, state }) {
            const arr = []
            const arrObj = new Map()
            for (let num = 0; num < state.baseList.length; num++) {
                arr[num] = state.baseList[num].id
            }
            arr.sort(() => Math.random() - 0.5)
            for (let num = 0; num < state.baseList.length; num++) {
                arrObj.set(arr[num], true)
            }
            const deletIndex = state.baseList.findIndex(el => el.id === state.currentMusic.musicData.id)
            if (state.baseList[deletIndex]) { arrObj.delete(state.baseList[deletIndex].id) }
            commit(SET_MAP_OBJECT, arrObj)
        },
        FETCH_RANDOMMUSIC ({ commit, state }) {
            const iterator = state.randomList.keys()
            const value = iterator.next().value
            const findResult = state.baseList.findIndex(el => el.id === value)
            const data = { musicData: state.baseList[findResult],
                musicIndex: findResult
            }
            commit(REMOVE_INDEX_RANDOMLIST, value)
            commit(SET_CURRNETMUSIC_OBJECT, data)
        }
    }
}
)
