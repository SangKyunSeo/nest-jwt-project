<template>
    <div class="home">
        <CmHeader :msg="msg" @loginStatus="changeLoginStatus" />
        <v-btn v-if="loginStatus" @click="moveWriteBoard">
            <span>글쓰기</span>
        </v-btn>
    </div>
</template>

<script setup lang="ts">
/**
 * @description
 *    - title: 메인
 *    - menu: 메인
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231226
 *    - rework: 완료
 *    - uxWriting: 완료
 */
import CmHeader from '../components/common/header/CmHeader.vue';
import { Ref, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const msg = ref('Nest Vue3 Vuetify JWT');
const store = useStore();
const router = useRouter();

let loginStatus: Ref<boolean> = ref(false);

const changeLoginStatus = (data: boolean): void => {
    loginStatus.value = data;
}

const moveWriteBoard = () => {
    router.push({
        path: '/writeBoard'
    });
}
onMounted(() => {
    loginStatus.value = store.state.User.isLogined;
})

</script>
