<template>
    <CmHeader :msg="msg" @loginStatus="backToHome" />
    <WriteForm @loginStatus="backToHome" />
</template>
<script setup lang="ts">
/**
 * @description
 *    - title: 글쓰기
 *    - menu: 메인 > 글쓰기
 *    - layout: WriteBoard
 *    - dev: 서상균
 *    - devVersion : 01_20231228
 *    - rework: 완료
 *    - uxWriting: 완료
 */

import CmHeader from '@/components/common/header/CmHeader.vue';
import WriteForm from '@/components/common/form/WriteForm.vue';
import { ref, Ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const msg: Ref<string> = ref('글쓰기');
const router = useRouter();
const store = useStore();
const backToHome = (data: boolean): void => {
    if (!data) {
        router.push('/');
    }
}

const checkLogin = () => {
    if (!store.state.User.isLogined) {
        alert('Login is essential!');
        router.push('/');
    }
}

onBeforeMount(() => {
    checkLogin();
})
</script>