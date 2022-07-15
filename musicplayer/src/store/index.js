import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
import { SET_CURRNETMUSIC,
    SET_CURRENTMUSIC_INIT,
    SET_CURRNETMUSIC_OBJECT,
    REMOVE_INDEX,
    SET_MAP_OBJECT,
    REMOVE_INDEX_RANDOMLIST,
    SET_CHECKLIST_ADD } from './mutation-type'
import { findNextMucic, findBeforeMusic } from '../lib/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        footprintList: {
        },
        randomList: [],
        allPlayList: [],
        currentMusic: {},
        checkList: {}
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
            state.checkList.set()
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
            for (let id of removeIds) {
                removeIndex = state.baseList.findIndex(el => String(el.id) === String(id))
                state.baseList.splice(removeIndex, 1)
                state.randomList.delete(Number(id))
            }
            for (const value in state.baseList) {
                state.baseList[value].index = Number(value)
                if (state.baseList[value].id === state.currentMusic.musicData.id) {
                    state.currentMusic.musicIndex = Number(value)
                }
            }
        },
        [SET_MAP_OBJECT]: (state, data) => {
            state.randomList = data
        },
        [REMOVE_INDEX_RANDOMLIST]: (state, value) => {
            state.randomList.delete(value)
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
