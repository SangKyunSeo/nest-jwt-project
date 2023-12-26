<template>
    <CmHeader :msg="msg" />
    <div>
    </div>
</template>
<script setup lang="ts">
import CmHeader from '@/components/common/header/CmHeader.vue';
import { ref, Ref } from 'vue';

const msg: Ref<string> = ref('글쓰기');

</script>