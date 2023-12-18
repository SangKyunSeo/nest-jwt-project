<template>
  <div class="home">
      <CmHeader :msg="msg"/>
  </div>
</template>

<script setup lang="ts">
/**
 * @description
 *    - title: 메인
 *    - menu: 메인
 *    - layout: Main
 *    - dev: 서상균
 *    - devVersion : 01_20231218
 *    - rework: 진행중
 *    - uxWriting: 진행중
 */
import CmHeader from '../components/common/header/CmHeader.vue';
import { ref } from 'vue';

const msg = ref('Nest Vue3 Vuetify JWT');

</script>
