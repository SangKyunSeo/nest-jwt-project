<template>
    <v-app>
        <router-view />
    </v-app>
</template>
<script setup lang="ts">
import { useStore } from 'vuex';
import { onBeforeMount } from 'vue';
const store = useStore();

onBeforeMount(() => {
    if (store.state.User.isLogined) {
        // 로그인 상태라면, 사용자 정보로 store 세팅
        store.dispatch('User/setLoggedStatus');
    }
})



</script>
<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

nav {
    padding: 30px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}

nav a.router-link-exact-active {
    color: #42b983;
}
</style>
