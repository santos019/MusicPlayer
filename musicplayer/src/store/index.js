import Vue from 'vue'
import Vuex from 'vuex'
import musicData from '@/assets/musicData.json'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        baseList: musicData,
        allPlayList: []
    },
    getters: {
        baseList (state) {
            return state.baseList
        }
    },
    mutations: {

    },
    actions: {

    }
})
