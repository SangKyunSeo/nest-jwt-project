<template>
    <nav>
        <v-toolbar color="white" fixed app>
            <v-btn @click="goHome">
                <span>Home</span>
            </v-btn>
            <v-toolbar-title class="text-uppercase grey--text">
                <span>{{ msg }}</span>
            </v-toolbar-title>
            <span v-if="isLogined" class="font-weight-regular">
                <b>{{ userName }}</b>님 안녕하세요!
            </span>
            <v-btn v-if="!isLogined" prepend-icon="mdi-account" color="blue" @click="login">
                <span>로그인</span>
            </v-btn>
            <v-btn v-else prepend-icon="mdi-account" color="red" @click="logout">
                <span>로그아웃</span>
            </v-btn>

        </v-toolbar>
    </nav>
    <LoginModal v-if="loginModal" :title="String(title)" :dialog="Boolean(loginModal)" @loginModal="modalStatus"
        @registerModal="openRegisterModal" @loginSuccess="changeStatus" />
    <RegisterModal v-if="registerModal" :title="String('Register')" :dialog="Boolean(registerModal)"
        @registerModal="closeRegisterModal" />
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 메인 헤더
 *    - menu: 메인 
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231226
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import { defineProps, onMounted, ref, Ref, defineEmits } from 'vue';
import { useStore } from 'vuex';
import LoginModal from '../modal/LoginModal.vue';
import RegisterModal from '../modal/RegisterModal.vue';
import { AxiosI } from "@/util/axiosInterceptor";
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const title: Ref<String> = ref('로그인');
const axiosI = new AxiosI();
const axios = axiosI.setupInterceptors();
const emit = defineEmits(['loginStatus']);

let isLogined: Ref<Boolean> = ref(false);
let loginModal: Ref<Boolean> = ref(false);
let registerModal: Ref<boolean> = ref(false);
let userName: Ref<string> = ref('');

defineProps({
    msg: {
        type: String
    }
});

const goHome = () => {
    router.push('/');
}

// Open the login modal
const login = () => {
    loginModal.value = true;
    registerModal.value = false;
}

// Close the login Modal
const modalStatus = (data: boolean): void => {
    loginModal.value = data;
}

// Open the register modal
const openRegisterModal = (data: boolean): void => {
    registerModal.value = data;
    loginModal.value = false;
}

// Close the register modal
const closeRegisterModal = (data: boolean): void => {
    registerModal.value = data;
}

// Do logout
const logout = () => {
    store.dispatch('User/setLogoutStorage');
    isLogined.value = false;

    // Delete Cookie 
    clearCookie();

    emit('loginStatus', false);
}

// Delete Cookie function
const clearCookie = async (): Promise<void> => {
    await axios.get('/user/logout')
        .then(res => {
            console.log(res.data);
            if (res.data) {
                alert('로그아웃 했습니다.');
            } else {
                alert('로그아웃을 실패했습니다.');
            }
        })
        .catch(error => {
            console.log(error);
        })

}

// Success Login
const changeStatus = (data: boolean) => {
    if (data) {
        userName.value = store.state.User.userName;
        isLogined.value = store.state.User.isLogined;
        modalStatus(false);
        emit('loginStatus', true);
    }
}
onMounted(() => {
    isLogined.value = store.state.User.isLogined;
    userName.value = store.state.User.userName;
});

</script>