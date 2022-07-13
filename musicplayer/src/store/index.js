import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
import { SET_CURRNETMUSIC,
    SET_CURRENTMUSIC_INIT,
    SET_CURRNETMUSIC_OBJECT,
    REMOVE_INDEX } from './mutation-type'
import { findNextMucic, findBeforeMusic } from '../lib/index'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        allPlayList: [],
        currentMusic: {}
    },
    getters: {
        baseList (state) {
            return state.baseList
        },
        currentMusic (state) {
            return state.currentMusic
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
            console.log(removeIds)
            let removeIndex = 0
            for (let id of removeIds) {
                console.log('in')
                removeIndex = state.baseList.findIndex(el => String(el.id) === String(id))
                state.baseList.splice(removeIndex, 1)
            } // 반영하려면 나중에 localStorage에 저장하기
        }
    },
    actions: {
        FETCH_NEXTMUSIC ({ commit }) {
            console.log('ddd')
            const findResult = findNextMucic(this.state.baseList, this.state.currentMusic)
            const data = { musicData: this.state.baseList[findResult] === undefined ? -1 : this.state.baseList[findResult],
                musicIndex: findResult
            }
            console.log('data', data)
            commit(SET_CURRNETMUSIC_OBJECT, data)
        },
        FETCH_BEFOREMUSIC ({ commit }) {
            const findResult = findBeforeMusic(this.state.baseList, this.state.currentMusic)
            const data = {
                musicData: this.state.baseList[findResult],
                musicIndex: findResult
            }
            commit(SET_CURRNETMUSIC_OBJECT, data)
        }
    }
}
)
