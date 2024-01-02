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
import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

const msg: Ref<string> = ref('글쓰기');
const router = useRouter();

const backToHome = (data: boolean): void => {
    if (!data) {
        router.push('/');
    }
}
</script>