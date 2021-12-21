

const state = {
    addressTag: []
}

const mutations = {


    SET_ADDRESS_TAG: (state, addressTag) => {
        state.addressTag = addressTag
    },
}

const actions = {

    setAddressTag({ commit }, addressTag) {
        commit('SET_ADDRESS_TAG', addressTag)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}