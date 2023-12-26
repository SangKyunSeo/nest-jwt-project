import { Module, GetterTree, MutationTree, ActionTree } from "vuex";
import { UserState } from "./userType";
import { RootState } from "@/store";

const getters: GetterTree<UserState, RootState> = {
    getUserNum(state): number {
        return state.userNum;
    },
    getUserName(state): string {
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
    setLoginedStatus(state) {
        state.isLogined = true;
        state.userName = JSON.parse(localStorage.getItem("userName")!);
        state.userNum = JSON.parse(localStorage.getItem("userNum")!);
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
    setLoggedStatus({ commit }) {
        commit("setLoginedStatus");
    },
};

export const User: Module<UserState, RootState> = {
    namespaced: true,
    state: {
        userNum: 0,
        userName: "",
        isLogined: localStorage.getItem("login") === null ? false : JSON.parse(localStorage.getItem("login")!),
    },
    getters,
    mutations,
    actions,
};
