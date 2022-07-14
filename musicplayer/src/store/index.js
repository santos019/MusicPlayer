import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
import { SET_CURRNETMUSIC,
    SET_CURRENTMUSIC_INIT,
    SET_CURRNETMUSIC_OBJECT,
    REMOVE_INDEX,
    SET_MAP_OBJECT,
    REMOVE_INDEX_RANDOMLIST } from './mutation-type'
import { findNextMucic, findBeforeMusic } from '../lib/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        footprintList: {
        },
        randomList: [],
        allPlayList: [],
        currentMusic: {}
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
            // console.log(removeIds)
            let removeIndex = 0
            for (let id of removeIds) {
                // console.log('in', id)
                removeIndex = state.baseList.findIndex(el => String(el.id) === String(id))
                state.baseList.splice(removeIndex, 1)
                console.log(state.randomList.delete(Number(id)))
            } // 반영하려면 나중에 localStorage에 저장하기
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
            // console.log('ddd')
            const findResult = findNextMucic(state.baseList, state.currentMusic)
            const data = { musicData: state.baseList[findResult] === undefined ? -1 : state.baseList[findResult],
                musicIndex: findResult
            }
            // console.log('data', data)
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
            console.log(state.baseList[deletIndex].id)
            arrObj.delete(state.baseList[deletIndex].id)
            // arrObj.set(28, 'test')
            // const iterator = arrObj.keys()
            // console.log(iterator.next().value)
            // console.log(iterator.next().value)
            commit(SET_MAP_OBJECT, arrObj)
        },
        FETCH_RANDOMMUSIC ({ commit, state }) {
            const iterator = state.randomList.keys()
            const value = iterator.next().value
            console.log('value', value)
            const findResult = state.baseList.findIndex(el => el.id === value)
            console.log('findResult', findResult)
            const data = { musicData: state.baseList[findResult],
                musicIndex: state.baseList[findResult].index
            }
            commit(REMOVE_INDEX_RANDOMLIST, value)
            // console.log('data', data)
            commit(SET_CURRNETMUSIC_OBJECT, data)
        }
    }
}
)
