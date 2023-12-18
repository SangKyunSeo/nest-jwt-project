import { Module, GetterTree, MutationTree, ActionTree } from 'vuex';
import { MemberState } from "./userType";
import { RootState } from '@/store';

const getters: GetterTree<MemberState, RootState> = {
    getMemberName(state) : String{
        return state.memberName;
    },
    getLoginStatus(state) : Boolean{
        return state.isLogined;
    }
}

const mutations: MutationTree<MemberState> = {
    setMemberName(state, memberName){
        state.memberName = memberName;
    },
    setLoginStatus(state, isLogined){
        state.isLogined = isLogined;
    },
    setLogin(state){
        localStorage.setItem('memberName', JSON.stringify(state.memberName));
        localStorage.setItem('login', JSON.stringify(state.isLogined));
    },
    setLogout(state){
        state.isLogined = false;
        state.memberName = '';
        localStorage.removeItem('login');
        localStorage.removeItem('memberName');
    }
}

const actions: ActionTree<MemberState, RootState> = {
    setStoreMemberName({ commit }, memberName){
        commit('setMemberName', memberName);
    },
    setStoreLoginStatus({commit}, isLogined){
        commit('setLoginStatus', isLogined);
    },
    setLoginStorage({commit}){
        commit('setLogin');
    },
    setLogoutStorage({commit}){
        commit('setLogout');
    }
}

export const User: Module<MemberState, RootState> = {
    namespaced: true,
    state: {
        memberName : '',
        isLogined : false
    },
    getters,
    mutations,
    actions
}