import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import { UserState } from "./userType";
import { RootState } from "@/store";

const getters: GetterTree<UserState, RootState> = {
    getUserNum(state): number {
        return state.userNum;
    },
    getUserName(state): String {
        return state.userName;
    },
    getLoginStatus(state): Boolean {
        return state.isLogined;
    },
};

const mutations: MutationTree<UserState> = {
    setUserNum(state, userNum) {
        state.userNum = userNum;
    },
    setUserName(state, userName) {
        state.userName = userName;
    },
    setLoginStatus(state, isLogined) {
        state.isLogined = isLogined;
    },
    setLogin(state) {
        localStorage.setItem("userNum", JSON.stringify(state.userNum));
        localStorage.setItem("userName", JSON.stringify(state.userName));
        localStorage.setItem("login", JSON.stringify(state.isLogined));
    },
    setLogout(state) {
        state.isLogined = false;
        state.userName = "";
        state.userNum = 0;
        localStorage.removeItem("login");
        localStorage.removeItem("userName");
        localStorage.removeItem("userNum");
    },
};

const actions: ActionTree<UserState, RootState> = {
    setStoreUserNum({ commit }, userNum) {
        commit("setUserNum", userNum);
    },
    setStoreUserName({ commit }, userName) {
        commit("setUserName", userName);
    },
    setStoreLoginStatus({ commit }, isLogined) {
        commit("setLoginStatus", isLogined);
    },
    setLoginStorage({ commit }) {
        commit("setLogin");
    },
    setLogoutStorage({ commit }) {
        commit("setLogout");
    },
};

export const User: Module<UserState, RootState> = {
    namespaced: true,
    state: {
        userNum: 0,
        userName: "",
        isLogined: false,
    },
    getters,
    mutations,
    actions,
};
